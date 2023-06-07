import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkPost } from '../../../entities/workpost.entity';
import { QueryRunner, Repository, DataSource } from 'typeorm';
import { OrderServicePG } from '../order/order.service';

@Injectable()
export class WorkPostServicePG {
  constructor(
    @InjectRepository(WorkPost)
    private workPostRepository: Repository<WorkPost>,
    @Inject(forwardRef(() => OrderServicePG))
    private orderServicePG: OrderServicePG,
    private dataSource: DataSource,
  ) {}

  async findWorkPost(condition = {}): Promise<WorkPost> {
    const findedWorkPost = await this.workPostRepository.findOne(condition);
    return findedWorkPost;
  }

  async findWorkPosts(condition = {}): Promise<WorkPost[]> {
    const findedWorkPosts = await this.workPostRepository.find(condition);
    return findedWorkPosts;
  }

  async setToWorkPostWhithTransaction(order, queryRunner: QueryRunner) {
    const updatedWorkPost = await queryRunner.manager.update(
      WorkPost,
      { id: order.workPost.id },
      { order },
    );
    return updatedWorkPost;
  }

  async setToWorkPost(order, workPost) {
    const updatedWorkPost = await this.workPostRepository
      .createQueryBuilder('workPost')
      .update({ order })
      .where('id = :id', { id: workPost.id })
      .execute()
      .then((res) => res.raw[0]);
    return updatedWorkPost;
  }

  async unsetWorkPostWhithTransaction(order, workPostId, completeCondition) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let updatedWorkPost;
    let updatedOrder;
    try {
      updatedWorkPost = await queryRunner.manager.update(WorkPost, workPostId, {
        order: null,
      });
      if (completeCondition?.orderStatus === 'closed') {
        updatedOrder = await this.orderServicePG.updateWithTransaction(
          order,
          completeCondition,
          queryRunner,
        );
      }
      await queryRunner.commitTransaction();
      return { updatedWorkPost, updatedOrder };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  async unSetWithDeleteOrderAndTransaction(
    workPostId,
    queryRunner: QueryRunner,
  ) {
    return queryRunner.manager.update(WorkPost, workPostId, {
      order: null,
    });
  }
}
