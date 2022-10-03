import { Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Req, Redirect } from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientService } from '../client/client.service';
import { CarService } from '../car/car.service';
import { WorkPostService } from '../workpost/workpost.service';
import { CreateOrderDTO } from '../../dto/create-order.dto';
import { UpdateOrderDTO } from '../../dto/update-order.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { createOrderNumber } from '../../helpers/number-generator';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService, private carService: CarService, private clientService: ClientService, private workPostService: WorkPostService) { }


  @Get('all')
  @Render('order/orders-p')
  async getOrders(@Query('page') page: number) {
    const currentPage = page ?? 1;
    const step = 12;
    const sortCondition = { createdAt: 'desc' };
    const orders = await this.orderService.showAll(currentPage, step, sortCondition);
    return { ...orders };
  };


  @Get(':orderId')
  @Render('order/edit-order')
  async getOrderForEdit(@Res() res, @Param('orderId', new ValidateObjectId()) orderId) {
    const order = await this.orderService.findOrder(orderId);
    const car = await this.carService.findCar(order.car);
    const client = await this.clientService.findOne(order.client);
    return { car, client, order };
  }

  @Get('/res/queue')
  async getOrderInqueue(@Res() res) {
    const ordersInQueue = await this.orderService.findOrdersByConditionPopulate({ workPost: 'queue' });
    return res.status(HttpStatus.OK).json(ordersInQueue);
  }

  @Get('/res/:orderId')
  async getOrder(@Res() res, @Param('orderId', new ValidateObjectId()) orderId) {
    const order = await this.orderService.findOrder(orderId);
    return res.status(HttpStatus.OK).json(order);
  }



  @Get('/create/:clientId/:carId')
  @Render('order/create-order')
  async createOrder(@Res() res, @Param('clientId', new ValidateObjectId()) clientId, @Param('carId', new ValidateObjectId()) carId) {
    const car = await this.carService.findCar(carId);
    const client = await this.clientService.findOne(clientId);
    return { car, client }
  }

  @Post('new')
  async create(@Res() res, @Body() createOrderDTO: CreateOrderDTO) {
    const car = await this.carService.findCar(createOrderDTO.car);
    const client = await this.clientService.findOne(createOrderDTO.client);
    const orderNumber = createOrderNumber(car, client);
    const createdOrder = await this.orderService.create({ ...createOrderDTO, number: orderNumber });
    if (!createdOrder) throw new NotFoundException('New order is not created!');
    if (createdOrder.workPost !== 'queue') {
      const setOrderToWorkpost = await this.workPostService.setToWorkPost(createdOrder);
      if (!setOrderToWorkpost) throw new NotFoundException('New order is not seted to work post!');
    }
    return res.redirect(`/order/${createdOrder['_id']}`);
  }

  @Put('/update/:orderId')
  async updateOrder(@Req() req, @Res() res, @Param('orderId', new ValidateObjectId()) orderId, @Body() updateOrderDTO: UpdateOrderDTO) {
    const updatedOrder = await this.orderService.update(orderId, updateOrderDTO);
    if (!updatedOrder) throw new NotFoundException('Order is not updated!');
    // return res.redirect(302, `/order/${orderId}`);
    return res.status(HttpStatus.OK).json({
      message: "Order has been updated successfully!",
      order: updatedOrder,
    });
  }

  @Delete(':orderId')
  async deleteOrder(@Req() req, @Res() res, @Param('orderId', new ValidateObjectId()) orderId) {
    const deletedOrder = await this.orderService.delete(orderId);
    if (!deletedOrder) throw new NotFoundException('Order is not deleted!');
    return res.status(HttpStatus.OK).json({
      message: "Order has been deleted successfully!",
      order: deletedOrder,
    });
  }
}
