import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si no se especifican roles, permite el acceso (o cambia a false si quieres todo cerrado por defecto)
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Verifica si el rol del usuario (del token) está en la lista de roles permitidos
    return requiredRoles.some((role) => user.role === role);
  }
}