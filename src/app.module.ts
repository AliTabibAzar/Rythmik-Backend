import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UserModule } from './user/user.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { RedisModule } from './shared/redis/redis.module';
import { AudioModule } from './audio/audio.module';
import { UploadModule } from './upload/upload.module';
import { CategoryModule } from './category/category.module';
import { LatestsModule } from './latests/latests.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.label({ label: 'API' }),
            winston.format.timestamp(),
            winston.format.printf(({ level, message, label, timestamp }) => {
              return `${timestamp} [${label}] ${level}: ${message}`;
            }),
          ),
          filename: './logs/log.log',
          level: 'http',
          maxsize: 1024 * 1024 * 10,
        }),
      ],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      connectionFactory: (connection) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
    }),
    RedisModule,
    AuthModule,
    UserModule,
    AudioModule,
    UploadModule,
    CategoryModule,
    LatestsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
