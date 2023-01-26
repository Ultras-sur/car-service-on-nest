import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkPost } from 'entities/workpost.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkPostServicePG {
  constructor(
    @InjectRepository(WorkPost) private workPostRepository: Repository<WorkPost>,
  ) {}

  async findWorkPost(condition = {}): Promise<WorkPost> {
    const findedWorkPost = await this.workPostRepository.findOne(condition);
    return findedWorkPost;
  }
}