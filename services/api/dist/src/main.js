"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 API corriendo en: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map