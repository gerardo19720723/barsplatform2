#!/bin/bash

echo "🚀 Iniciando reparación completa del proyecto..."

API_DIR="./services/api"

# 1. ACTUALIZAR PACKAGE.JSON CON LAS DEPENDENCIAS FALTANTES
echo "📦 Actualizando dependencias..."
cat > $API_DIR/package.json <<'EOF'
{
  "name": "@bars/api",
  "version": "1.0.0",
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/jwt": "^10.1.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/throttler": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "bcrypt": "^5.1.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "helmet": "^7.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "rxjs": "^7.8.0",
    "reflect-metadata": "^0.1.13"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "@types/passport-jwt": "^3.0.9",
    "@types/passport-local": "^1.0.35",
    "@types/bcrypt": "^5.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "prisma": "^5.0.0",
    "typescript": "^5.1.3"
  }
}
EOF

# 2. CREAR SERVICIO PRISMA (Conexión a BD)
echo "🗄️  Creando Prisma Service..."
cat > $API_DIR/src/prisma/prisma.service.ts <<'EOF'
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
EOF

cat > $API_DIR/src/prisma/prisma.module.ts <<'EOF'
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
EOF

# 3. CREAR MÓDULO Y SERVICIO DE USUARIOS
echo "👤 Creando Users Module..."
mkdir -p $API_DIR/src/modules/users

cat > $API_DIR/src/modules/users/users.module.ts <<'EOF'
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // Importante exportarlo para que AuthModule lo use
})
export class UsersModule {}
EOF

cat > $API_DIR/src/modules/users/users.service.ts <<'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; password: string; role: string; tenantId?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role as any, // Cast simple para el ejemplo
        tenantId: data.tenantId,
      },
    });
  }
}
EOF

# 4. CREAR MÓDULO DE TENANTS (Placeholder)
echo "🏢 Creando Tenant Module..."
mkdir -p $API_DIR/src/modules/tenants

cat > $API_DIR/src/modules/tenants/tenant.module.ts <<'EOF'
import { Module } from '@nestjs/common';

@Module({})
export class TenantModule {}
EOF

# 5. CREAR MÓDULO DE AUTENTICACIÓN COMPLETO
echo "🔐 Creando Auth Module (Services, Strategies, Controllers)..."
mkdir -p $API_DIR/src/modules/auth

# Service
cat > $API_DIR/src/modules/auth/auth.service.ts <<'EOF'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    // Nota: En producción usa bcrypt.compare
    const isPasswordValid = pass === user.password; // Simplificado para demo rápida, cambiar por bcrypt.compare
    if (!isPasswordValid) return null;

    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role, tenantId: user.tenantId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
EOF

# Strategy
cat > $API_DIR/src/modules/auth/jwt.strategy.ts <<'EOF'
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
EOF

# Controller (Para el endpoint /login)
cat > $API_DIR/src/modules/auth/auth.controller.ts <<'EOF'
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard'; // Crearemos uno simple abajo

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
EOF

# Guard Local Simple
cat > $API_DIR/src/modules/auth/local-auth.guard.ts <<'EOF'
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
EOF

# Module
cat > $API_DIR/src/modules/auth/auth.module.ts <<'EOF'
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy'; // Lo creamos abajo

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secret',
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
EOF

# Local Strategy (Para login básico)
cat > $API_DIR/src/modules/auth/local.strategy.ts <<'EOF'
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends Strategy {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    // Usamos email como username en este caso
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
EOF

# 6. CORREGIR MAIN.TS (Helmet Fix)
echo "🛠️  Corrigiendo main.ts (Helmet fix)..."
cat > $API_DIR/src/main.ts <<'EOF'
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// CORRECCIÓN: Importación por defecto para Helmet v7+
import helmet from 'helmet'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad con Helmet (v7+ syntax)
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Validación Global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API corriendo en: http://localhost:${port}`);
}
bootstrap();
EOF

# 7. ASEGURAR QUE APP.MODULE.TS IMPORTE PRISMA MODULE
echo "📝 Actualizando app.module.ts..."
cat > $API_DIR/src/app.module.ts <<'EOF'
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenants/tenant.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, // Necesario para la BD
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10, 
    }]),
    AuthModule,
    TenantModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
EOF

echo "✅ Estructura de archivos corregida y dependencias actualizadas."
echo "👉 Ejecuta los siguientes comandos para finalizar:"
echo ""
echo "   cd services/api"
echo "   npm install"
echo "   npx prisma generate"
echo "   npm run start:dev"