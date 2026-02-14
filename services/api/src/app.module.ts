import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessModule } from './modules/business/business.module';
import { IngredientsModule } from './modules/ingredients/ingredients.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller'; // <--- AGREGAR ESTO

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ThrottlerModule.forRoot([{
      ttl: 60000, 
      limit: 10, 
    }]),
    AuthModule,
    TenantModule,
    UsersModule,
    BusinessModule,
    IngredientsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}