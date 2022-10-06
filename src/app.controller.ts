import { Controller, Get, Render, Post, Param, ParseIntPipe, Body, Redirect, Res, Query } from '@nestjs/common';
import { CarService } from './car/car.service';
import { OrderService } from './order/order.service';
import { WorkPostService } from './workpost/workpost.service';

@Controller()
export class AppController {
  constructor(private orderService: OrderService, private carService: CarService, private workPostService: WorkPostService) { }

  @Get()
  @Render('workpost/monitor')
  async getMonitor(@Query('page') page: number) {
    const currentpage = page ?? 1;
    const getWorkPosts = await this.workPostService.getWorkPosts();

    const workPosts = await Promise.all(getWorkPosts.map(async workPost => {
      if (workPost.car) {
        const car = await this.carService.findCar(workPost.car);
        const orderInfo = await this.orderService.findOrder(workPost.order);
        return {
          number: workPost.number,
          car,
          status: 'working',
          order: { number: orderInfo.number, id: orderInfo['_id'] }
        };

      } else {
        return {
          number: workPost.number,
          car: { model: '', brand: '' },
          status: 'free',
          order: { number: '' }
        };
      }
    }));

    const ordersInQueue = await this.orderService
      .findOrdersByConditionPaginate({ orderStatus: 'opened', workPost: 'queue' }, currentpage);
    return { workPosts, ordersInQueue };
  }

  @Get('/auth')
  @Render('auth/auth')
  async login() {
    return {};
  }
}
