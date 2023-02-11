import { Controller, Get, Render, Post, Res, Req, UseGuards, UseFilters, Query, HttpStatus } from '@nestjs/common';
import { CarService } from './car/car.service';
import { OrderService } from './order/order.service';
import { WorkPostService } from './workpost/workpost.service';
import { Response, Request } from 'express';
import { LoginGuard } from 'src/auth/common/guards/login.guard';
import { AuthenticatedGuard } from 'src/auth/common/guards/authenticated.guard';
import { RolesGuard } from './auth/common/guards/roles.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { Role } from '../schemas/user.schema';
import { Roles } from './auth/roles.decorator';
import { WorkPostServicePG } from './postgres/workpost/pg-workpost.service';
import { OrderServicePG } from './postgres/order/order.service';
import { OrderPageOptionsDTO } from './postgres/order/dto/order-page-options';


@Controller()
@UseFilters(AuthExceptionFilter)

export class AppController {
  constructor(
    private orderService: OrderService,
    private orderServicePG: OrderServicePG,
    private carService: CarService,
    private workPostService: WorkPostService,
    private workPostServicePG: WorkPostServicePG,
  ) {}

  @Get('/login')
  @Render('auth/auth')
  index(@Req() req, @Res() res: Response): { message: string, loginPage: boolean } | void {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    return { message: req.flash('loginError'), loginPage: true };
  }

  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Res() res: Response) {
    return res.redirect('/');
  }


  @Get('/logout')
  logout(@Req() req, @Res() res: Response) {
    /*req.session.destroy(() => {
      res.cookie('connect.sid', null, {
           path: "/",
           httpOnly: true,
           maxAge: 0,
           expires: new Date(0)
       })
       return res.redirect('/login');
    }) */

    res.cookie('connect.sid', null, {
      path: "/",
      httpOnly: true,
      maxAge: 0,
      expires: new Date(0)
    })
    return res.redirect('/login');
  }


  @Get('/')
  @Render('workpost/monitor')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthenticatedGuard)
  async getMonitor(@Query('page') page: number, @Req() req) {
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
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    
    return { workPosts, ordersInQueue, isAdmin };
  }

  @Get('pgmonitor')
  @Render('pg/workpost/monitor')
  async getPgMonitor(@Req() req, @Query() query: OrderPageOptionsDTO) {
    const workPosts = await this.workPostServicePG.findWorkPosts({
      relations: { order: { car: { brand: true, model: true } } },
      order: { number: 'ASC' },
    });

    const orderPageOptions = new OrderPageOptionsDTO(query);
    const ordersInQueue = await this.orderServicePG
      .findOrdersPaginate(orderPageOptions)
      .then((orderData) => {
        const { data, meta } = orderData;
        const filteredData = data.filter(
          (order) => order.orderStatus === 'opened' && order.workPost === null,
        );
        return { data: filteredData, meta };
      });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return {
      workPosts,
      ordersInQueue,
      isAdmin,
    };
  }
}
