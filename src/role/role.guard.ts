import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/Schemas/users.schema';
import { ROLES_KEY } from 'src/role/role.decorator';
import { LogsService } from '../logging/logs.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private logsService: LogsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const contextType = context.getType();
    let user;
    let ip;
    let url;

    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest();
      user = request.user;
      ip = request.ip;
      url = request.url;
    } else if (contextType === 'ws') {
      const client = context.switchToWs().getClient();
      user = client.handshake?.user;
      ip = client.handshake?.address;
      url = client.handshake?.url;
    }

    if (!user?.role) {
      await this.logsService.logUnauthorizedAccess(
        url,
        `Unauthenticated access attempt from IP: ${ip}`
      );
      throw new UnauthorizedException();
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      await this.logsService.logUnauthorizedAccess(
        url,
        `IP ${ip} with role ${user.role} attempted to access endpoint requiring roles: ${requiredRoles.join(', ')}`,
        user.email
      );
      throw new UnauthorizedException('Insufficient permissions');
    }

    return true;
  }
}