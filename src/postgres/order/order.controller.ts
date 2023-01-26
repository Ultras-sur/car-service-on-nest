import { Controller, Get, Render, Req, Query, Param, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { Role } from 'schemas/user.schema';
import { CarServicePG } from '../car/car.service';
import { OrderPageOptionsDTO } from './dto/order-page-options';
import { OrderServicePG } from './order.service';
import { ClientServisePG } from '../client/pg-client.service';
import { WorkPostServicePG } from '../workpost/pg-workpost.service';

@Controller('pgorder')
export class OrderControllerPG {
  constructor(
    private orderServicePG: OrderServicePG,
    private carServicePG: CarServicePG,
    private clientServicePG: ClientServisePG,
    private workPostServicePG: WorkPostServicePG,
  ) {}

  @Get('/')
  @Render('pg/order/orders')
  async getOrders(
    @Req() req,
    @Query() orderPageOptionsDTO: OrderPageOptionsDTO,
  ) {
    const orders = await this.orderServicePG.findOrdersPaginate(
      orderPageOptionsDTO,
    );
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { orders, isAdmin, step: 10, page: 1, totalPages: 1 };
  }

  @Get('new/:carId')
  @Render('pg/order/create-order')
  async getCreateForm(@Req() req, @Param('carId') carId) {
    const car = await this.carServicePG.findCar({
      where: { id: carId },
      relations: { owner: true, brand: true, model: true },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { car, isAdmin };
  }

  @Post('new')
  async createNewOrder(@Res() res, @Body() orderData) {
    console.log(orderData);
    const car = await this.carServicePG.findCar({
      where: { id: orderData.car },
      relations: { brand: true },
    });
    const client = await this.clientServicePG.findClient(orderData.client);
    const workPost = await this.workPostServicePG.findWorkPost({
      where: { number: orderData.workPost },
    });
    const newOrder = await this.orderServicePG.createOrder({
      car,
      client,
      workPost,
      jobs: orderData.jobs,
    });
    //return res.redirect(`${newOrder.id}`);
    return res.status(HttpStatus.OK).json(newOrder);
  }
}
