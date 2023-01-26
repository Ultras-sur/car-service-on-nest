import { Injectable } from '@nestjs/common';
import { Order } from 'entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';

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
        car: { brand: true, model: true },
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

  async createOrder(createOrderDTO: CreateOrderDTO) {
    const orderNumber =
      `${Math.floor(Math.random() * 10)}` + `${createOrderDTO.car.brand.toString()}`;
    const newOrder = this.orderRepository.create({
      ...createOrderDTO,
      number: orderNumber,
    });
    await this.orderRepository.save(newOrder);
    return newOrder;
  }
}
