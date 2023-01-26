import { Injectable } from '@nestjs/common';
import { Order } from 'entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class OrderServicePG {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async findOrdersPaginate(carPageOptions) {
    const ordersAndCount = await this.orderRepository.findAndCount({
      select: {
        id: true,
        number: true,
        createdAt: true,
        orderStatus: true,
      },
      relations: {
        car: true,
        client: true,
      },
      where: {
        client: {
          name: carPageOptions.client
            ? Like(`%${carPageOptions.client}%`)
            : null,
        },
        number: carPageOptions.number
          ? Like(`%${carPageOptions.number}%`)
          : null,
      },
    });

    const [orders, ordersCount] = ordersAndCount;
    return orders;
  }
}
