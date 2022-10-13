import { Req, Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, UseGuards, UseFilters } from '@nestjs/common';
import { WorkPostService } from './workpost.service';
import { CarService } from '../car/car.service';
import { OrderService } from '../order/order.service';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { Role } from 'schemas/user.schema';
import { Roles } from '../auth/roles.decorator';


@Controller('workpost')
@UseFilters(AuthExceptionFilter)
@UseGuards(RolesGuard)

export class WorkPostController {
  constructor(private workPostService: WorkPostService, private carService: CarService, private orderService: OrderService) { }

  @UseGuards(AuthenticatedGuard)
  @Get('/workposts')
  @Roles(Role.ADMIN, Role.MANAGER)    
  async getWorkPosts(@Res() res) {
    const workPosts = await this.workPostService.getWorkPosts();
    return res.status(HttpStatus.OK).json(workPosts);
  }
  
  @UseGuards(AuthenticatedGuard)
  @Get('/workpoststatus')
  @Render('workpost/workposts') 
  @Roles(Role.ADMIN, Role.MANAGER)    
  async getStatus() {
    const workPostsStatus = await this.workPostService.getWorkPosts();
    const workPosts = await Promise.all(workPostsStatus.map(async workPost => {
      if (workPost.car) {
        
        const car = await this.carService.findCar(workPost.car);
        const orderInfo = await this.orderService.findOrder(workPost.order);
        return {
          number: workPost.number,
          car,
          status: 'working',
          order: { number: orderInfo.number, jobs: orderInfo.jobs, id: orderInfo['_id'] }
        };
      } else {
        return {
          number: workPost.number,
          car: { model: '', brand: '' },
          status: 'free',
          order: { number: '' }
        }
      }
    }));
    const ordersInQueue = await this.orderService
      .findOrdersByConditionPopulate({ orderStatus: 'opened', workPost: 'queue' });
    return { workPosts, ordersInQueue };
  }
  @UseGuards(AuthenticatedGuard)
  @Post('/unset')
  @Roles(Role.ADMIN, Role.MANAGER)    
  async unset(@Res() res, @Body() workPostData, @Req() req) {
    const { order, workPost } = workPostData;
    const completeCondition = workPostData.complete === 'true' ? { orderStatus: 'closed' } : {};
    const unsetedOrder =
      await this.orderService.update(order, { ...{ workPost: 'queue' }, ...completeCondition });
    const workPostToUnset = await this.workPostService.unsetWorkPost(workPost);
    return res.redirect('workpoststatus');
  }
    
  @UseGuards(AuthenticatedGuard)
  @Post('/set')
  @Roles(Role.ADMIN, Role.MANAGER)     
  async set(@Res() res, @Body() workPostData) {
    const { order, workPost } = workPostData;
    const orderToSet = await this.orderService.update(order, { workPost });
    const workPostToSet = await this.workPostService.setToWorkPost(orderToSet);
    return res.redirect('workpoststatus');
  }


  /*@Get('/createworkpost')
  async createWorkPost(@Res() res) {
    const newWorkPost = await this.workPostService.createWorkPost();
    return res.status(HttpStatus.OK).json({
      message: 'OK',
      workPost: newWorkPost,
    })
  }*/
}
