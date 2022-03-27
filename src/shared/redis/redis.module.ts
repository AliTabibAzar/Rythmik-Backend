import { CacheModule, Module } from '@nestjs/common';
import { RedisClientOptions } from 'redis';
import { RedisService } from './redis.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
