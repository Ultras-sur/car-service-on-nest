import { Controller, Get, Render, Post, Param, ParseIntPipe, Body, Redirect, Res, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CarService } from './car/car.service';
import { OrderService } from './order/order.service';
import { WorkPostService } from './workpost/workpost.service';

@Controller()
export class AppController {
  constructor(private orderService: OrderService, private carService: CarService, private workPostService: WorkPostService) { }

  @Get('old')
  @Render('workpost/workstatus')
  async getStatus(@Res() res) {
    const getWorkPosts = await this.workPostService.getWorkPosts();
    const workPosts = await getWorkPosts.reduce(async (prev, workPost) => {
      const acc = await prev;
      if (workPost.car) {
        const car = await this.carService.findCar(workPost.car);
        const orderInfo = await this.orderService.findOrder(workPost.order);
        acc.push({
          number: workPost.number,
          car,
          status: 'working',
          order: { number: orderInfo.number, id: orderInfo['_id'] }
        });
        return acc;
      } else {
        acc.push({
          number: workPost.number,
          car: { model: '', brand: '' },
          status: 'free',
          order: { number: '' }
        });
        return acc;
      }
    }, Promise.resolve([]));

    const openedOrders = await this.orderService.findOrders({ status: 'opened' });
    const ordersInQueue = await openedOrders.reduce(async (prev, order) => {
      const acc = await prev;
      if (order.workPost === 'queue') {
        const car = await this.carService.findCar(order.car);
        order.car = car;
        acc.push(order);
      }
      return acc;
    }, Promise.resolve([]));
    return { workPosts, ordersInQueue };
  }

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
}
