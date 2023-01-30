import { Controller, Get, Render, Req, Query, Param, Post, Res, Body, HttpStatus, Put } from '@nestjs/common';
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

  @Get('/res/:orderId')
  async getOrderForFetch(@Res() res, @Param('orderId') orderId) {
    const order = await this.orderServicePG.findOrder({
      where: { id: orderId },
    });
    return res.status(HttpStatus.OK).json(order);
  }

  @Get(':orderId')
  @Render('pg/order/edit-order')
  async getOrder(@Res() res, @Req() req, @Param('orderId') id) {
    const order = await this.orderServicePG.findOrder({
      relations: { client: true, car: { brand: true, model: true } },
      where: { id },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    //return res.status(HttpStatus.OK).json(order);
    return { order, isAdmin };
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
      relations: { brand: true, model: true },
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
    return res.redirect(`${newOrder.id}`);
    //return res.status(HttpStatus.OK).json(newOrder);
  }

  @Put('/update/:orderId')
  async updateOrder(
    @Res() res,
    @Param('orderId') orderId,
    @Body() updateOrderDTO,
  ) {
    const updatedOrder = await this.orderServicePG.updateOrder(
      orderId,
      updateOrderDTO,
    );
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }
}