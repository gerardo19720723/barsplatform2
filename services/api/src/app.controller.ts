import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      status: 'ok',
      message: '🚀 Backend Bars-Platform funcionando en puerto 3001',
      timestamp: new Date().toISOString(),
    };
  }
}