import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication, LoggerService } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { WorkPostServicePG } from './pg-workpost.service';
import { WorkPost } from 'entities/workpost.entity';
import { OrderServicePG } from '../order/order.service';

describe('WorkPostServicePG', () => {
  let app: INestApplication;
  let workPostServicePG;
  let orderServicePG;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    workPostServicePG = app.get<WorkPostServicePG>(WorkPostServicePG);
    orderServicePG = app.get<OrderServicePG>(orderServicePG);
  });

  afterAll(async () => {
    await app.close();
  });
  it('should be defined', () => {
    expect(workPostServicePG).toBeDefined();
  });

  describe('findWorkPosts', () => {
    it('returned array of workPost entity', async () => {
      const workPosts = await workPostServicePG.findWorkPosts({});
      expect(Array.isArray(workPosts)).toBe(true);
      workPosts.forEach((workPost) => {
        expect(workPost).toBeInstanceOf(WorkPost);
      });
    });
  });
  describe('SetOrderToWorkPost', () => {
    it('Set order to workPost', async () => {
      const workposts = await workPostServicePG.findWorkPosts({});
      const ordersInWorkposts = workposts.reduce((acc, workPost) => {
        if (workPost.order !== null) acc.push(workPost.order);
      }, []);
      const freeWorkPosts = workposts.filter(
        (workpost) => workpost.order === null,
      );
      const orders = await orderServicePG.findOrders({});
      const ordersWithOutWorkPost = orders.filter(
        (order) => !ordersInWorkposts.includes(order.id),
      );
    });
  });
});
