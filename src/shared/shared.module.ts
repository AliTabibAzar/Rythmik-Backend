import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [MailModule, RedisModule],
  providers: [],
})
export class SharedModule {}
