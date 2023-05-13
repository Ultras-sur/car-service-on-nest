import { Test, TestingModule } from '@nestjs/testing';
import { Order } from 'entities/order.entity';
import { OrderControllerPG } from './order.controller';
import { OrderServicePG } from './order.service';

describe('OrderController', () => {
  let orderControllerPG: OrderControllerPG;
  let orderServicePG: OrderServicePG;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderControllerPG],
      providers: [OrderServicePG],
    }).compile();

    orderControllerPG = moduleRef.get<OrderControllerPG>(OrderControllerPG);
    orderServicePG = moduleRef.get<OrderServicePG>(OrderServicePG);
  });

  describe('findAll', () => {
    it('should return array of orders', async () => {
      const result = [
        {
          id: '313dc852-f8de-4a19-9356-a681d30c2ed5',
          number: 'VC52CD7384',
          updatedAt: null,
          orderStatus: 'opened',
          jobs: [
            {
              job: '6dfe7762-4ec7-481e-b290-2f9f562bf11e',
              cost: 7000,
              name: 'Покраска двери',
            },
          ],
          car: '52f5014c-cdac-43df-9ab1-2ef2711cdd5f',
          client: 'ab772a72-9268-4171-9054-6108333c9b6b',
        },
      ];

      /*jest
        .spyOn(orderServicePG, 'findOrdersPaginate')
        .mockImplementation(() => result);
        */
    });
  });
});
