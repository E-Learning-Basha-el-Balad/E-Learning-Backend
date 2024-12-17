import { Injectable, ExecutionContext, UnauthorizedException,CanActivate} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../auth/public.decorator';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,private reflector: Reflector ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
          if (isPublic) {
            return true;
          }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookie(request);
        
        if (!token) {
            throw new UnauthorizedException('No token, please login');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
        return true;
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.jwt;
    }
}