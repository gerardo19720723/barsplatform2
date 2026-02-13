import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'; // <--- Esta es la clave que faltaba
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) { // <--- Heredamos de PassportStrategy
  constructor(private authService: AuthService) {
    // Pasamos las opciones para indicar que el campo de usuario se llama 'email'
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  // NestJS llama a este método automáticamente gracias a PassportStrategy
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}