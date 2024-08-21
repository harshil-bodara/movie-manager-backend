import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const backendPort = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(backendPort, () => {
    console.log(`Backend is successfully running on ${backendPort}`);
  });
}
bootstrap();
