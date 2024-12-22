import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Response, ResponseDocument } from '../Schemas/responses.schema';
import { Quiz, QuizDocument } from '../Schemas/quizzes.schema';
import { QuestionBank, QuestionBankDocument } from '../Schemas/questionBank.schema';
import { User, UserDocument } from '../Schemas/users.schema'; 
import { createResponseDto } from './responsesDto/createResponse.dto';
import { updateResponseDto } from './responsesDto/updateResponse.dto';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { ProgressService } from 'src/progress/progress.service';
import { Module } from 'src/Schemas/modules.schema';
import { Course } from 'src/Schemas/courses.schema'
import { CreateProgressDto } from 'src/progress/dto/CreateProgress.dto';
@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<ResponseDocument>,
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(QuestionBank.name) private questionBankModel: Model<QuestionBank>,
    @InjectModel(User.name) private userModel: Model<User>, // Add this
    @InjectModel('Module') private moduleModel: Model<Module>,
    @InjectModel('Course') private courseModel: Model<Course>,
    private progressService: ProgressService,
    private readonly quizzesService: QuizzesService,
  ) {}

  /**
   * Create a new response for a quiz
   */
  async createResponse(responseData: createResponseDto): Promise<Response> {
    const { user_id, quiz_id, answers } = responseData;
  
    // Fetch the user and their corresponding quiz questions by difficulty
    const quizQuestions: QuestionBankDocument[] = (await this.quizzesService.findByUserId(user_id, quiz_id)) as QuestionBankDocument[];
  
    // Validate Answers and Calculate Score
    let score = 0;
    const validatedAnswers = [];
  
    for (const answer of answers) {
      // Ensure the question is part of the filtered quiz questions
      const question = quizQuestions.find(
        (q) => q._id.toString() === answer.question_id  // _id is now part of the Mongoose document
      );
  
      if (!question) {
        throw new BadRequestException(
          `Invalid or unauthorized question ID: ${answer.question_id}`
        );
      }
  
      // Check if the user's answer is correct
      const isCorrect = question.correct_answer === answer.user_answer;
      if (isCorrect) score++;
  
      // Push validated answer with correctness and the correct answer
      validatedAnswers.push({
        question_id: question._id,
        user_answer: answer.user_answer,
        correct_answer: question.correct_answer, // Store the correct answer
      });
    }
  
    // Generate the message based on the user's performance
    const totalQuestions = quizQuestions.length;
    let message = '';
    if (score >= totalQuestions * 0.75) {
      message = 'GREAT JOB';
    } else if (score >= totalQuestions / 2) {
      message = 'Good work but needs improvement';
    } else {
      message = `You need to revise the module. Your score: ${score} / ${totalQuestions}`;
    }
  
    const normalizedScore = score / totalQuestions;
  
    // Update the user's GPA
    await this.updateUserGPA(user_id, normalizedScore);
    
    score= score*100/totalQuestions;
    // Create the Response document
    const newResponse = new this.responseModel({
      user_id,
      quiz_id,
      answers: validatedAnswers,
      score,
      submitted_at: new Date(),
      message,
    });

    const quiz = await this.quizModel.findById(quiz_id).exec();
    const module = await this.moduleModel.find({ _id: quiz.module_id }).exec();
    const moduleJSON = JSON.parse(JSON.stringify(module));
    const courseId = moduleJSON.course_id;

    const modules = await this.moduleModel.find({ course_id: courseId }).exec();
    const modulesJSON = JSON.parse(JSON.stringify(modules));
    let totalQuizzes = 0;

    // Calculate total quizzes
    for (const module of modules) {
      const quizzesCount = await this.quizModel.countDocuments({ module_id: module._id }).exec();
      totalQuizzes += quizzesCount;
    }

    let responsesJSON = [];

    for (const module of modules) {
      const quizzes = await this.quizModel.find({ module_id: module._id }).exec();
      const quizzesJSON = JSON.parse(JSON.stringify(quizzes));
      const quizIds = quizzesJSON.map(quiz => quiz._id);

      const responses = await this.responseModel.find({ quiz_id: { $in: quizIds } }).exec();
      responsesJSON = JSON.parse(JSON.stringify(responses));
    }

    const uniqueResponses = Array.from(new Map(responsesJSON.map(response => [response.quiz_id, response])).values());
    const completionPercentage = uniqueResponses.length/totalQuizzes;

    const progress: CreateProgressDto = {
      user_id: user_id.toString(),
      course_id: courseId,
      completion_percentage: completionPercentage * 100,
      last_accessed: new Date(),
      };
      
      await this.progressService.createProgress(progress);

  
    return await newResponse.save();
  }

  private async updateUserGPA(user_id: ObjectId, normalizedScore: number): Promise<void> {
    const user = await this.userModel.findById(user_id);
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
  
    // Example GPA adjustment logic (scale GPA to a max of 4.0)
    const currentGPA = user.gpa || 0;
    
    // Calculate the impact of the quiz on GPA
    const gpaImpact = (normalizedScore - 0.5) * 2; 
    // `normalizedScore - 0.5`: A score of 50% has no impact. Above increases GPA, below decreases GPA.
    // Multiply by a factor (2 here) to scale the impact.
  
    const newGPA = Math.max(0, Math.min(currentGPA + gpaImpact, 4.0)); // Ensure GPA is between 0 and 4.0
  
    // Update the user's GPA in the database
    user.gpa = newGPA;
    await user.save();
  }
  
  

  /**
   * Retrieve a response by ID
   */
  async findResponseById(id: string): Promise<Response> {
    const response = await this.responseModel.findById(id).populate(['quiz_id', 'answers.question_id']);
    if (!response) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }
    return response;
  }

  /**
   * Retrieve all responses for a specific quiz
   */
  async findResponsesByQuiz(quiz_id: string): Promise<Response[]> {
    const responses = await this.responseModel.find({ quiz_id });
    if (responses.length === 0) {
      throw new NotFoundException(`No responses found for Quiz ID ${quiz_id}`);
    }
    return responses;
  }

  /**
   * Retrieve all responses for a specific user
   */
  async findResponsesByUser(user_id: string): Promise<Response[]> {
    const responses = await this.responseModel.find({ user_id }).populate('quiz_id');
    if (responses.length === 0) {
      throw new NotFoundException(`No responses found for User ID ${user_id}`);
    }
    return responses;
  }

  /**
   * Delete a response by ID
   */
  
}
