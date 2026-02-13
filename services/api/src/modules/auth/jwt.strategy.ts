import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
     const secret = configService.get<string>('JWT_SECRET') || 'default-secret';
    
    // --- AGREGA ESTE LOG PARA DEPURACIÓN ---
    console.log('🔑 EL SECRETO QUE ESTÁ USANDO EL SERVIDOR ES:', secret);
    console.log('🔑 LONGITUD DEL SECRETO:', secret.length);
    super({
       jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'), 
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: any) {
    console.log('🔍 Validando Token. Payload:', payload);
    return { userId: payload.sub, email: payload.email, role: payload.role, tenantId: payload.tenantId };
  }
}
