import { FactoryProvider, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

const logger = new Logger();

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    });

    redisInstance.on('connect', (error) => {
      logger.log('Redis is connected');
    });

    redisInstance.on('error', (error) => {
      logger.error('Redis connection error: ' + error);
      throw new Error('Redis connection failed: ' + error);
    });

    return redisInstance;
  },
  inject: [],
};
