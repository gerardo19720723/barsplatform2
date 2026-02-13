#!/bin/bash

echo "🔧 Corrigiendo errores críticos de TypeScript y Passport..."

# Asegurarnos de estar en la carpeta correcta (o asumir que se ejecuta desde services/api)
# Si ejecutas esto desde la raíz, cambia API_DIR a "./services/api"
API_DIR="." 

# 1. CORREGIR LOCAL STRATEGY (El error de super())
echo "🛠️  Arreglando local.strategy.ts (Argumentos faltantes)..."
cat > $API_DIR/src/modules/auth/local.strategy.ts <<'EOF'
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends Strategy {
  constructor(private authService: AuthService) {
    // FIX: Passport-local necesita un objeto de configuración
    super({
      usernameField: 'email', // Indicamos que usaremos 'email' en lugar de 'username'
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    // El email viene en 'username' debido a la configuración arriba,
    // pero Passport Strategy hace el mapeo automáticamente si usamos el objeto.
    // Sin embargo, la validación recibe los campos según los definimos arriba.
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
EOF

# 2. CREAR/RECREAR ARCHIVOS DE PRISMA (Para arreglar "Cannot find module")
echo "🗄️  Recreando archivos de Prisma..."
mkdir -p $API_DIR/src/prisma

# Prisma Service
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

# Prisma Module
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

# 3. VERIFICAR USER SERVICE PATH
echo "👤 Verificando Users Service..."
# Aseguramos que el archivo exista y tenga la ruta correcta de importación
# Ruta actual esperada: services/api/src/modules/users/users.service.ts
# Importación: ../../prisma/prisma.service
# Esto es correcto si el archivo users.service está en modules/users/

cat > $API_DIR/src/modules/users/users.service.ts <<'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Ruta relativa correcta
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
        role: data.role as any, 
        tenantId: data.tenantId,
      },
    });
  }
}
EOF

echo "✅ Archivos corregidos."
echo "👉 Reinicia el servidor: npm run start:dev"