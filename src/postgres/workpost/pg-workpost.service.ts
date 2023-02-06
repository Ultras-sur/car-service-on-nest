import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkPost } from 'entities/workpost.entity';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class WorkPostServicePG {
  constructor(
    @InjectRepository(WorkPost)
    private workPostRepository: Repository<WorkPost>,
  ) {}

  async findWorkPost(condition = {}): Promise<WorkPost> {
    const findedWorkPost = await this.workPostRepository.findOne(condition);
    return findedWorkPost;
  }

  async findWorkPosts(condition = {}): Promise<WorkPost[]> {
    const findedWorkPosts = await this.workPostRepository.find(condition);
    return findedWorkPosts;
  }

  async setToWorkPost(order, queryRunner: QueryRunner) {
    const updatedWorkPost = await queryRunner.manager.update(
      WorkPost,
      { id: order.workPost.id },
      { order },
    );
    return updatedWorkPost;
  }

  async unsetWorkPost(workPostId, queryRunner: QueryRunner) {
    const workPost = await queryRunner.manager.update(
      WorkPost,
      { number: workPostId },
      { order: null },
    );
    return workPost;
  }
}