import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, HydratedDocument, ObjectId, Types } from 'mongoose';
import { Quiz, QuizDocument, QuizSchema } from '../Schemas/quizzes.schema';
import { Module } from '../Schemas/modules.schema';
import { QuestionBank } from '../Schemas/questionBank.schema';
import { updateQuizzesDTo } from './quizzesDto/updateQuizzes.dto';
import { createQuizzesDTo } from './quizzesDto/createQuizzes.dto';
import { User } from 'src/Schemas/users.schema';


@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>, // Use `Quiz.name`
    @InjectModel(Module.name) private moduleModel: Model<Module>,
    @InjectModel(QuestionBank.name) private questionBankModel: Model<QuestionBank>,
    @InjectModel(User.name) private userModel: Model<User>,
  ){console.log('QuizSchema:', QuizSchema);
    console.log('QuizModel:', this.quizModel); }

  // Create a new quiz
async create(QuizData: createQuizzesDTo): Promise<Quiz> {
  const { module_id, typeOfQuestions, questions, numOfQuestions } = QuizData;

  // Ensure that the provided module_id exists in the Module collection
  const module = await this.moduleModel.findById(module_id);
  if (!module) {
    throw new NotFoundException(`Module with ID ${module_id} not found`);
  }

  const existingQuiz = await this.quizModel.findOne({ module_id });
  if (existingQuiz) {
    throw new BadRequestException(
      `A quiz already exists for the module "${module.title}". Only one quiz is allowed per module.`
    );
  }

  // Fetch random questions if `questions` is not explicitly provided
  let selectedQuestions = [];
  if (!questions || questions.length === 0) {
    selectedQuestions = await this.getRandomQuestions(
      module_id,
      typeOfQuestions,
      numOfQuestions
    ); // Store question IDs
  } 
  //else {
  //   // Validate the provided question IDs
  //   const questionDocs = await this.questionBankModel.find({ _id: { $in: questions } });
  //   if (questionDocs.length !== questions.length) {
  //     throw new BadRequestException('One or more questions are invalid');
  //   }
  //   selectedQuestions = questionDocs.map((q) => q._id); // Store question IDs
  // }

  // Create the quiz document
  const newQuiz = new this.quizModel({
    module_id,
    questions: selectedQuestions,
    numOfQuestions, // Include numOfQuestions
    typeOfQuestions, // Include typeOfQuestions
    created_at: new Date(),
  });

  // Save the quiz to the database
  return await newQuiz.save();
}


// Helper method to fetch random questions
private async getRandomQuestions(
  module_id: string,
  typeOfQuestions: string[],
  numOfQuestions: number
): Promise<mongoose.Types.ObjectId[]> {
  const matchCriteria: any = { module_id: new mongoose.Types.ObjectId(module_id) };
  if (typeOfQuestions?.length > 0) {
    matchCriteria.type = { $in: typeOfQuestions };
  }

  const questionDocs = await this.questionBankModel.aggregate([
    { $match: matchCriteria },
    { $sample: { size: numOfQuestions } },
  ]);

  if (questionDocs.length < numOfQuestions) {
    throw new BadRequestException(
      `Not enough questions available in the question bank for the specified criteria (${questionDocs.length || 0} found, ${numOfQuestions} needed).`
    );
  }

  return questionDocs.map((q) => q._id);
}

  
  // private async validateQuestionIds(
  //   questions: mongoose.Types.ObjectId[]
  // ): Promise<mongoose.Types.ObjectId[]> {
  //   const questionDocs = await this.questionBankModel.find({ _id: { $in: questions } });
  
  //   if (questionDocs.length !== questions.length) {
  //     throw new BadRequestException(
  //       'One or more provided question IDs are invalid or do not exist.'
  //     );
  //   }
  
  //   return questionDocs.map((q) => q._id);
  // }

  async findByQuizId(quiz_id:string): Promise<Quiz>{
    const quiz = await this.quizModel.findById(quiz_id);

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quiz_id} not found`);
    }

    return quiz;
  }
  

  async findByUserId(user_id: ObjectId, quiz_id: string): Promise<QuestionBank[]> {
    // Fetch the user document
    const user = await this.userModel.findById(user_id);
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
  
    // Fetch the quiz and populate the `questions` field
    const quiz = await this.quizModel
      .findById(quiz_id)
      .populate<{ questions: QuestionBank[] }>('questions'); // Add type for populated field
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quiz_id} not found`);
    }
  
    // Determine difficulty based on the user's GPA
    let difficulty: string;
    if (user.gpa >= 3.0) {
      difficulty = 'A'; // Hard questions for high GPA
    } else if (user.gpa >= 2.0) {
      difficulty = 'B'; // Moderate questions for medium GPA
    } else {
      difficulty = 'C'; // Easy questions for low GPA
    }
  
    // Filter questions in the quiz by difficulty
    const filteredQuestions = quiz.questions.filter(
      (q) => q.difficulty === difficulty
    );
  
    if (filteredQuestions.length === 0) {
      throw new NotFoundException(
        `No questions found for difficulty ${difficulty} in quiz ID ${quiz_id}`
      );
    }
  
    return filteredQuestions;
  }
  
  
  
  
  
  // Get all quizzes
  async findAll(): Promise<Quiz[]> {
    let quizzes= await this.quizModel.find();  // Fetch all students from the database
    return quizzes
}

  // Update a quiz by ID
  async update(quizId: string, updateQuizData: Partial<createQuizzesDTo>): Promise<Quiz> {
    const { module_id, typeOfQuestions, questions, numOfQuestions } = updateQuizData;
  
    // Find the quiz by ID to ensure it exists
    const existingQuiz = await this.quizModel.findById(quizId);
    if (!existingQuiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
  }

  // Fetch the current module details to get the title
    
    

  // Prevent the module from being changed
  const currentModule = await this.moduleModel.findById(existingQuiz.module_id);
  if (module_id && module_id !== existingQuiz.module_id.toString()) {
    throw new BadRequestException(
      `The module for this quiz cannot be changed. Current module: "${currentModule.title}".\nIf you want to Change the module you have to delete the quiz and create another one.`
    );
  }
    
    // Fetch random questions if `questions` is not explicitly provided
    if (!questions || questions.length === 0) {
      if (module_id || typeOfQuestions || numOfQuestions) {
        // Update questions based on new criteria
        const selectedQuestions = await this.getRandomQuestions(
          module_id || existingQuiz.module_id.toString(),
          typeOfQuestions || existingQuiz.typeOfQuestions || [],
          numOfQuestions || existingQuiz.numOfQuestions || 0
        );
        existingQuiz.questions = selectedQuestions;
      }
    } 
  
    // Update other fields
    if (typeOfQuestions) existingQuiz.typeOfQuestions = typeOfQuestions;
    if (numOfQuestions) existingQuiz.numOfQuestions = numOfQuestions;
  
    // Update the quiz in the database
    await existingQuiz.save();
    return existingQuiz;
  }
  

  // Delete a quiz by ID
  async delete(id: string): Promise<Quiz> {
    return await this.quizModel.findByIdAndDelete(id);  // Find and delete the student
}
}
