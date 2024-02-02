import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
  constructor(private readonly redisRepository: RedisRepository) {}

  async getClientSessions(prefix: string) {
    return this.redisRepository.keys(prefix);
  }

  async getSession(prefix: string, sessionId: string) {
    const session = await this.redisRepository.get(prefix, sessionId);
    return JSON.parse(session);
  }

  async deleteSession(prefix: string, id: string): Promise<any> {
    return this.redisRepository.delete(prefix, id);
  }
}
