import { Req, Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete } from '@nestjs/common';
import { WorkPostService } from './workpost.service';
import { CarService } from '../car/car.service';
import { OrderService } from '../order/order.service';

@Controller('workpost')
export class WorkPostController {
  constructor(private workPostService: WorkPostService, private carService: CarService, private orderService: OrderService) { }

  /*@Get('/createworkpost')
  async createWorkPost(@Res() res) {
    const newWorkPost = await this.workPostService.createWorkPost();
    return res.status(HttpStatus.OK).json({
      message: 'OK',
      workPost: newWorkPost,
    })
  }*/
  
  @Get('/workposts')
  async getWorkPosts(@Res() res) {
    const workPosts = await this.workPostService.getWorkPosts();
    return res.status(HttpStatus.OK).json(workPosts);
  }

  @Get('/workpoststatus')
  @Render('workpost/workposts')
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
          order: { number: orderInfo.number, jobs: orderInfo.jobs, id: orderInfo['_id'] }
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

  @Post('/unset')
  async unset(@Res() res, @Body() workPostData, @Req() req) {
    const { order, workPost } = workPostData;
    const unsetedOrder = await this.orderService.update(order, { workPost: 'queue' });
    const workPostToUnset = await this.workPostService.unsetWorkPost(workPost);
    return res.redirect('workpoststatus');
  }

  @Post('/set')
  async set(@Res() res, @Body() workPostData) {
    const { order, workPost } = workPostData;
    const orderToSet = await this.orderService.update(order, { workPost });
    const workPostToSet = await this.workPostService.setToWorkPost(orderToSet);
    return res.redirect('workpoststatus');
  }
}
