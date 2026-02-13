import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'; // Asegúrate que esta línea esté arriba

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    // ✅ CAMBIO CRÍTICO: Usar bcrypt.compare en lugar de ===
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    
    if (!isPasswordValid) {
      return null; // Contraseña incorrecta
    }

    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role, 
      tenantId: user.tenantId 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}