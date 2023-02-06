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
} from '@nestjs/common';
import { Role } from 'schemas/user.schema';
import { OrderServicePG } from '../order/order.service';
import { WorkPostServicePG } from '../workpost/pg-workpost.service';

@Controller('pgworkpost')
export class WorkPostControllerPG {
  constructor(
    private workPostServicePG: WorkPostServicePG,
    private orderServicePG: OrderServicePG,
  ) {}

  @Get('/')
  @Render('pg/workpost/workposts')
  async getWorkPosts(@Req() req) {
    const workPosts = await this.workPostServicePG.findWorkPosts({
      relations: { order: { car: { brand: true, model: true } } },
      order: { number: 'ASC' },
    });
    const ordersInQueue = await this.orderServicePG.findOrders({
      relations: { car: { brand: true, model: true } },
      where: { workPost: null },
      order: { createdAt: 'DESC' },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { workPosts, ordersInQueue, isAdmin };
  }

  @Get('res/status')
  async getStatusFetch(@Res() res) {
    const workPosts = await this.workPostServicePG.findWorkPosts({
      relations: { order: true },
    });
    return res.status(HttpStatus.OK).json(workPosts);
  }
}
