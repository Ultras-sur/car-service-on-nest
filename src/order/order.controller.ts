import { Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Req, Redirect, UseGuards, UseFilters } from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientService } from '../client/client.service';
import { CarService } from '../car/car.service';
import { WorkPostService } from '../workpost/workpost.service';
import { CreateOrderDTO } from '../../dto/create-order.dto';
import { UpdateOrderDTO } from '../../dto/update-order.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { createOrderNumber } from '../../helpers/number-generator';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { Role } from 'schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';


@Controller('order')
@UseFilters(AuthExceptionFilter)
@UseGuards(RolesGuard)

export class OrderController {
  constructor(private orderService: OrderService, private carService: CarService, private clientService: ClientService, private workPostService: WorkPostService) { }

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  @Render('order/orders-p')
  @Roles(Role.ADMIN, Role.MANAGER)  
  async getOrders(@Query('page') page: number) {
    const currentPage = page ?? 1;
    const step = 12;
    const sortCondition = { createdAt: 'desc' };
    const orders = await this.orderService.showAll(currentPage, step, sortCondition);
    return { ...orders };
  };

  @UseGuards(AuthenticatedGuard)
  @Get(':orderId')
  @Render('order/edit-order')
  @Roles(Role.ADMIN, Role.MANAGER)  
  async getOrderForEdit(@Res() res, @Param('orderId', new ValidateObjectId()) orderId) {
    const order = await this.orderService.findOrder(orderId);
    const car = await this.carService.findCar(order.car);
    const client = await this.clientService.findOne(order.client);
    return { car, client, order };
  }

  @UseGuards(AuthenticatedGuard)  
  @Get('/res/queue')
  @Roles(Role.ADMIN, Role.MANAGER)  
  async getOrderInqueue(@Res() res) {
    const ordersInQueue = await this.orderService.findOrdersByConditionPopulate({ workPost: 'queue' });
    return res.status(HttpStatus.OK).json(ordersInQueue);
  }

  @UseGuards(AuthenticatedGuard)  
  @Get('/res/:orderId')
  @Roles(Role.ADMIN, Role.MANAGER)  
  async getOrder(@Res() res, @Param('orderId', new ValidateObjectId()) orderId) {
    const order = await this.orderService.findOrder(orderId);
    return res.status(HttpStatus.OK).json(order);
  }


  @UseGuards(AuthenticatedGuard)
  @Get('/create/:clientId/:carId')
  @Render('order/create-order')
  @Roles(Role.ADMIN, Role.MANAGER)  
  async createOrder(@Res() res, @Param('clientId', new ValidateObjectId()) clientId, @Param('carId', new ValidateObjectId()) carId) {
    const car = await this.carService.findCar(carId);
    const client = await this.clientService.findOne(clientId);
    return { car, client }
  }

  @UseGuards(AuthenticatedGuard)  
  @Post('new')
  @Roles(Role.ADMIN, Role.MANAGER)  
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

  @UseGuards(AuthenticatedGuard)    
  @Put('/update/:orderId')
  @Roles(Role.ADMIN, Role.MANAGER)  
  async updateOrder(@Req() req, @Res() res, @Param('orderId', new ValidateObjectId()) orderId, @Body() updateOrderDTO: UpdateOrderDTO) {
    const updatedOrder = await this.orderService.update(orderId, updateOrderDTO);
    if (!updatedOrder) throw new NotFoundException('Order is not updated!');
    // return res.redirect(302, `/order/${orderId}`);
    return res.status(HttpStatus.OK).json({
      message: "Order has been updated successfully!",
      order: updatedOrder,
    });
  }

  @UseGuards(AuthenticatedGuard)    
  @Delete(':orderId')
  @Roles(Role.ADMIN)  
  async deleteOrder(@Req() req, @Res() res, @Param('orderId', new ValidateObjectId()) orderId) {
    const deletedOrder = await this.orderService.delete(orderId);
    if (!deletedOrder) throw new NotFoundException('Order is not deleted!');
    return res.status(HttpStatus.OK).json({
      message: "Order has been deleted successfully!",
      order: deletedOrder,
    });
  }
}
