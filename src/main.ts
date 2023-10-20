import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const configService = app.get(ConfigService);
  app.enableCors();  
  app.useGlobalPipes(new ValidationPipe());

  
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
