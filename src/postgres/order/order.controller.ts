import {
  Controller,
  Get,
  Render,
  Req,
  Query,
  Param,
  Post,
  Res,
  Body,
  HttpStatus,
  Put,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { Role } from 'schemas/user.schema';
import { CarServicePG } from '../car/car.service';
import { OrderPageOptionsDTO } from './dto/order-page-options';
import { OrderServicePG } from './order.service';
import { ClientServicePG } from '../client/pg-client.service';
import { WorkPostServicePG } from '../workpost/pg-workpost.service';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from 'src/auth/common/guards/authenticated.guard';
import { RolesGuard } from 'src/auth/common/guards/roles.guard';
import { UserRole } from 'entities/user.entity';
import { RolesPG } from 'src/auth/roles.decorator';

@Controller('pgorder')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class OrderControllerPG {
  constructor(
    private orderServicePG: OrderServicePG,
    private carServicePG: CarServicePG,
    private clientServicePG: ClientServicePG,
    private workPostServicePG: WorkPostServicePG,
  ) {}

  @Get('/')
  @Render('pg/order/orders')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async getOrders(@Req() req, @Query() query) {
    const orderPageOptions = new OrderPageOptionsDTO(query);
    const orders = await this.orderServicePG.findOrdersPaginate(
      orderPageOptions,
    );
    const serchString = `${req.url.replace(
      /\/pgorder\??(page=\d+\&?)?/im,
      '',
    )}`;
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { orders, serchString, isAdmin };
  }

  @Get('/res/:orderId')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async getOrderForFetch(@Res() res, @Param('orderId') orderId) {
    const order = await this.orderServicePG.findOrder({
      where: { id: orderId },
    });
    return res.status(HttpStatus.OK).json(order);
  }

  @Get(':orderId')
  @Render('pg/order/edit-order')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async getOrder(@Res() res, @Req() req, @Param('orderId') id) {
    const order = await this.orderServicePG.findOrder({
      relations: {
        client: true,
        car: { brand: true, model: true },
        workPost: true,
      },
      where: { id },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { order, isAdmin };
  }

  @Get('new/:carId')
  @Render('pg/order/create-order')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async getCreateForm(@Req() req, @Param('carId') carId) {
    const car = await this.carServicePG.findCar({
      where: { id: carId },
      relations: { owner: true, brand: true, model: true },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { car, isAdmin };
  }

  @Post('new')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async createNewOrder(@Res() res, @Body() orderData) {
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
  }

  @Put('/update/:orderId')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async updateOrder(
    @Res() res,
    @Param('orderId') orderId,
    @Body() updateOrderDTO: UpdateOrderDTO,
  ) {
    const updatedOrder = await this.orderServicePG.updateOrderJobs(
      orderId,
      updateOrderDTO,
    );
    return res.status(HttpStatus.OK).json({ message: 'OK', updatedOrder });
  }

  @Put('setstatus/:orderId')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async setOrderStatus(
    @Res() res,
    @Param('orderId') orderId,
    @Body() UpdateOrderDTO: UpdateOrderDTO,
  ) {
    const { orderStatus } = UpdateOrderDTO;
    const updatedOrder = await this.orderServicePG.updateStatus(
      orderId,
      orderStatus,
    );
    return res.status(HttpStatus.OK).json({ message: 'OK', updatedOrder });
  }

  @Delete(':orderId')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  async deleteOrder(@Param('orderId') orderId, @Res() res) {
    let deletedOrder;
    try {
      const findedOrder = await this.orderServicePG.findOrder({
        where: { id: orderId },
        relations: { workPost: true },
      });
      deletedOrder = await this.orderServicePG.deleteOrderWithTransaction(
        findedOrder,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Order successfully deleted', order: deletedOrder });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
