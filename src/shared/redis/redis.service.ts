import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  //   Set a value to redis
  public async set(key: string, value: any, ttl?: number) {
    return await this.cacheManager.set(key, value, {
      ttl: ttl,
    });
  }

  //    Get a value from redis
  public async get(key: string) {
    return await this.cacheManager.get(key);
  }

  //    Delete a value from redis
  public async del(key: string) {
    return this.cacheManager.del(key);
  }
}
