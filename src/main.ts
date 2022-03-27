import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston/dist/winston.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(bodyParser.json({ limit: '1mb' }));
  // app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, PATCH, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Server running on port ${port}`, 'Bootstrap');
}
bootstrap();
