import { Injectable } from '@nestjs/common';
import { Order } from 'entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';
import { createOrderNumber } from 'helpers/number-generator';

@Injectable()
export class OrderServicePG {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async findOrder(condition = {}): Promise<Order> {
    const findedOrder = await this.orderRepository.findOne(condition);
    return findedOrder;
  }

  async findOrdersPaginate(carPageOptions) {
    console.log(carPageOptions);
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
          name: carPageOptions.name ? Like(`%${carPageOptions.name}%`) : null,
        },
        number: carPageOptions.orderNumber
          ? Like(`%${carPageOptions.orderNumber}%`)
          : null,
      },
    });

    const [orders, ordersCount] = ordersAndCount;
    return orders;
  }

  async createOrder(createOrderDTO: CreateOrderDTO) {
    const orderNumber = createOrderNumber(
      {
        _id: createOrderDTO.car.id,
        brand: createOrderDTO.car.brand.name,
        model: createOrderDTO.car.model.name,
      },
      { name: createOrderDTO.client.name },
    );

    const newOrder = this.orderRepository.create({
      ...createOrderDTO,
      number: orderNumber,
    });
    await this.orderRepository.save(newOrder);
    return newOrder;
  }
}
