import { Controller, Get, Render, Post, Res, Req, UseGuards, UseFilters, Query, Request } from '@nestjs/common';
import { CarService } from './car/car.service';
import { OrderService } from './order/order.service';
import { WorkPostService } from './workpost/workpost.service';
import { Response } from 'express';
import { LoginGuard } from 'src/auth/common/guards/login.guard';
import { AuthenticatedGuard } from 'src/auth/common/guards/authenticated.guard';
import { RolesGuard } from './auth/common/guards/roles.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { Role } from '../schemas/user.schema';
import { Roles } from './auth/roles.decorator';


@Controller()
@UseFilters(AuthExceptionFilter)

export class AppController {
  constructor(private orderService: OrderService, private carService: CarService, private workPostService: WorkPostService) { }

  
  @Get('/login')
  @Render('auth/auth')
  index(@Request() req): { message: string } {
    return { message: req.flash('loginError') };
  }
  
  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Res() res: Response, @Req() req: Request) {
    res.redirect('/');
  }


  @UseGuards(AuthenticatedGuard)
  @Get('/')
  @Render('workpost/monitor')
  @Roles(Role.ADMIN)   
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
