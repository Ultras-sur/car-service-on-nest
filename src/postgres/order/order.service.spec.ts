import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderServicePG } from './order.service';

describe('OrderService', () => {
  let service: OrderServicePG;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderServicePG],
    }).compile();

    service = module.get<OrderServicePG>(OrderServicePG);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
