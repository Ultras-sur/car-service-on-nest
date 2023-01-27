import { Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Req, Redirect, UseGuards, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './order.service';
import { ClientService } from '../client/client.service';
import { CarService } from '../car/car.service';
import { JobService } from '../job/job.service';
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
@UseGuards(AuthenticatedGuard)

export class OrderController {
  constructor(private orderService: OrderService, private carService: CarService, private clientService: ClientService, private jobService: JobService) { }


  @Get('all')
  @Render('order/orders-p')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getOrders(@Query('name') name: string,
    @Query('orderNumber') orderNumber: string,
    @Query('page') page: number, @Req() req) {
    const condition = {};
    const serchString = `${req.url.replace(/\/order\/all\??(page=\d+\&?)?/mi, '')}`;
    orderNumber ? condition['number'] = orderNumber : null;
    if (name) {
      const clients = await this.clientService.find({ name: new RegExp(name, 'gmi') });
      const potencialClientsId = clients.map(client => client['_id']);
      condition['client'] = potencialClientsId;
    }
    const currentPage = page ?? 1;
    const step = 10;
    const sortCondition = { createdAt: 'desc' };
    const orders = await this.orderService.showAll(currentPage, step, sortCondition, condition);
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { ...orders, isAdmin, serchString };
  };


  @Get('admin/orders')
  @Render('admin/orders')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getOrdersForAdmin(@Query('name') name: string,
    @Query('orderNumber') orderNumber: string,
    @Query('page') page: number, @Req() req) {
    const condition = {};
    const serchString = `${req.url.replace(/\/order\/admin\/orders\??(page=\d+\&?)?/mi, '')}`;
    orderNumber ? condition['number'] = orderNumber : null;
    if (name) {
      const clients = await this.clientService.find({ name: new RegExp(name, 'gmi') });
      const potencialClientsId = clients.map(client => client['_id']);
      condition['client'] = potencialClientsId;
    }
    const currentPage = page ?? 1;
    const step = 10;
    const sortCondition = { createdAt: 'desc' };
    const orders = await this.orderService.showAll(currentPage, step, sortCondition, condition);
    return { ...orders, isAdmin: true, serchString };
  }


  @Get(':orderId')
  @Render('order/edit-order')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getOrderForEdit(@Res() res: Response, @Param('orderId', new ValidateObjectId()) orderId, @Req() req) {
    const order = await this.orderService.findOrder(orderId);
    const fullJobsInfo = await Promise.all(order.jobs.map(async job => {
      const findedJob = await this.jobService.findJob(job[0]);
      return [...job, findedJob.name];
    }))
    const car = await this.carService.findCar(order.car);
    const client = await this.clientService.findOne(order.client);
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { car, client, order, fullJobsInfo, isAdmin };
  }


  @Get('/res/queue')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getOrderInqueue(@Res() res: Response) {
    const ordersInQueue = await this.orderService.findOrdersByConditionPopulate({ workPost: 'queue' });
    return res.status(HttpStatus.OK).json(ordersInQueue);
  }


  @Get('/res/:orderId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getOrder(@Res() res: Response, @Param('orderId', new ValidateObjectId()) orderId) {
    const order = await this.orderService.findOrder(orderId);
    return res.status(HttpStatus.OK).json(order);
  }



  @Get('/create/:clientId/:carId')
  @Render('order/create-order')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async createOrder(@Res() res: Response, @Param('clientId', new ValidateObjectId()) clientId, @Param('carId', new ValidateObjectId()) carId, @Req() req) {
    const car = await this.carService.findCar(carId);
    const client = await this.clientService.findOne(clientId);
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { car, client, isAdmin }
  }

  @Post('/set')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async setToWorkPost(@Res() res: Response, @Body() workPostData) {
    const { order, workPost } = workPostData;
    await this.orderService.setToWorkPost(order, workPost);
    return res.redirect('/workpost/workpoststatus');
  }

  @Post('/unset')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async unsetWorkPost(@Res() res: Response, @Body() workPostData) {
    const { order, workPost, complete } = workPostData;
    const completeCondition = complete === 'true' ? { orderStatus: 'closed' } : {};
    await this.orderService.unsetWorkPost(order, workPost, completeCondition);
    return res.redirect('/workpost/workpoststatus');
  }


  @Post('/new')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(@Res() res: Response, @Body() createOrderDTO: CreateOrderDTO) {
    console.log(createOrderDTO)
    const car = await this.carService.findCar(createOrderDTO.car);
    const client = await this.clientService.findOne(createOrderDTO.client);
    const orderNumber = createOrderNumber(car, client);
    const createdOrder = await this.orderService.create({ ...createOrderDTO, number: orderNumber });
    return res.redirect(`/order/${createdOrder['_id']}`);
  }


  @Put('/update/:orderId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async updateOrder(@Res() res: Response, @Param('orderId', new ValidateObjectId()) orderId, @Body() updateOrderDTO: UpdateOrderDTO) {
    const updatedOrder = await this.orderService.update(orderId, updateOrderDTO);
    if (!updatedOrder) throw new NotFoundException('Order is not updated!');
    return res.status(HttpStatus.OK).json({
      message: "Order has been updated successfully!",
      order: updatedOrder,
    });
  }


  @Delete(':orderId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteOrder(@Res() res: Response, @Param('orderId', new ValidateObjectId()) orderId) {
    const deletedOrder = await this.orderService.delete(orderId);
    if (!deletedOrder) throw new NotFoundException('Order is not deleted!');
    return res.status(HttpStatus.OK).json({
      message: "Order has been deleted successfully!",
      order: deletedOrder,
    });
  }
}
