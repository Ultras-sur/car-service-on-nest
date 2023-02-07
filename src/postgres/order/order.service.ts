import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Order } from 'entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, QueryRunner, Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';
import { createOrderNumber } from 'helpers/number-generator';
import { WorkPostServicePG } from '../workpost/pg-workpost.service';
import { OrderPageOptionsDTO } from './dto/order-page-options';
import { PageMetaDTO } from './dto/page-meta.dto';
import { PageDTO } from './dto/page.dto';
import { JobServicePG } from '../job/pg-job.service';

@Injectable()
export class OrderServicePG {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private dataSource: DataSource,
    @Inject(forwardRef(() => WorkPostServicePG))
    private workPostServicePG: WorkPostServicePG,
    private jobServicePG: JobServicePG,
  ) {}

  async findOrder(condition = {}): Promise<Order> {
    const findedOrder = await this.orderRepository.findOne(condition);
    return findedOrder;
  }

  async findOrders(condition = {}): Promise<Order[]> {
    const findedOrders = await this.orderRepository.find(condition);
    return findedOrders;
  }

  async findOrdersPaginate(orderPageOptions: OrderPageOptionsDTO) {
    const ordersAndCount = await this.orderRepository.findAndCount({
      select: {
        id: true,
        number: true,
        createdAt: true,
        orderStatus: true,
      },
      relations: {
        car: { brand: true, model: true },
        client: true,
        workPost: true,
      },
      where: {
        client: {
          name: orderPageOptions.name
            ? Like(`%${orderPageOptions.name}%`)
            : null,
        },
        number: orderPageOptions.orderNumber
          ? Like(`%${orderPageOptions.orderNumber}%`)
          : null,
        workPost: orderPageOptions.workPost ?? null,
      },
      order: { createdAt: orderPageOptions.order },
      skip: orderPageOptions.skip,
      take: orderPageOptions.take,
    });

    const [orders, ordersCount] = ordersAndCount;
    const pageMeta = new PageMetaDTO(ordersCount, orderPageOptions);
    return new PageDTO(orders, pageMeta);
  }

  async createOrder(createOrderDTO: CreateOrderDTO) {
    const queryRunner = this.dataSource.createQueryRunner();
    const orderJobs = await Promise.all(
      createOrderDTO.jobs.map(async (jobData) => {
        const findedJob = await this.jobServicePG.findJob({
          where: { id: jobData.job },
        });
        return {
          job: findedJob.id.toString(),
          cost: jobData.cost,
          name: findedJob.name,
        };
      }),
    );
    const orderNumber = createOrderNumber(
      {
        _id: createOrderDTO.car.id,
        brand: createOrderDTO.car.brand.name,
        model: createOrderDTO.car.model.name,
      },
      { name: createOrderDTO.client.name },
    );

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let newOrder;
    try {
      newOrder = queryRunner.manager.create(Order, {
        ...createOrderDTO,
        number: orderNumber,
        jobs: orderJobs,
      });
      await queryRunner.manager.save(Order, newOrder);
      if (newOrder.workPost) {
        await this.workPostServicePG.setToWorkPostWhithTransaction(
          newOrder,
          queryRunner,
        );
      }
      await queryRunner.commitTransaction();
      return newOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrder(orderId, updateOrderDTO) {
    const jobList = await Promise.all(
      updateOrderDTO.jobs.map(async (jobData) => {
        const findedJob = await this.jobServicePG.findJob({
          where: { id: jobData.job },
        });
        return { ...jobData, name: findedJob.name };
      }),
    );

    const updatedOrder = await this.orderRepository
      .createQueryBuilder('order')
      .update({ jobs: jobList, updatedAt: new Date() })
      .where('id = :id', { id: orderId })
      .returning('*')
      .execute()
      .then((res) => res.raw[0]);
    return updatedOrder;
  }

  async updateWithTransaction(
    order,
    completeCondition,
    queryRunner: QueryRunner,
  ) {
    const updatedOrder = await queryRunner.manager.update(
      Order,
      order.id,
      completeCondition,
    );
    return updatedOrder;
  }
}
