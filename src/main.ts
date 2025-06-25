import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DomainExceptionsFilter } from './shared/filters/domain-exception.filter';
import { LoggerService } from './infrastructure/logger/logger.service';
import * as dotenv from "dotenv";
import * as express from 'express';
import { join } from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  
  app.use('/videos', express.static(join(__dirname, '..', 'public', 'hls')));

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  const loggerService = await app.resolve(LoggerService);
  app.useGlobalFilters(new DomainExceptionsFilter(loggerService));
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
