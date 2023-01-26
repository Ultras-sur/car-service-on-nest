import { Controller, Get, Render, Req, Query } from '@nestjs/common';
import { Role } from 'schemas/user.schema';
import { CarPageOptionsDTO } from './dto/car-page-options';
import { OrderServicePG } from './order.service';

@Controller('pgorder')
export class OrderControllerPG {
  constructor(private orderServicePG: OrderServicePG) {}

  @Get('/')
  @Render('pg/order/orders')
  async getOrders(@Req() req, @Query() carPageOptionsDTO: CarPageOptionsDTO) {
    const orders = await this.orderServicePG.findOrdersPaginate(
      carPageOptionsDTO,
    );
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { orders, isAdmin };
  }
}
