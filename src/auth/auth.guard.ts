import { Injectable, ExecutionContext, UnauthorizedException,CanActivate} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookie(request);
        
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            
            request['user'] = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.jwt;
    }
}