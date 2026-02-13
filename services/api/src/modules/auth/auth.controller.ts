import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
// Importamos el Guard de JWT que viene con NestJS Passport
import { AuthGuard } from '@nestjs/passport'; 
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // --- NUEVA RUTA PROTEGIDA ---
  @UseGuards(AuthGuard('jwt')) // <--- Esto intercepta la petición y valida el token
  @Get('profile')
  getProfile(@Request() req) {
    // Si llegamos aquí, el token es válido.
    // 'req.user' contiene la información que decodificamos en 'jwt.strategy.ts'
    return {
      message: '✅ Acceso autorizado a datos privados',
      user_data: req.user, 
      hint: 'Este usuario solo debería ver datos de su Tenant (si tiene uno)'
    };
  }
}