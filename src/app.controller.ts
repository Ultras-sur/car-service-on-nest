import {
  Controller,
  Get,
  Render,
  Post,
  Res,
  Req,
  UseGuards,
  UseFilters,
  Query,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginGuard } from '../src/auth/common/guards/login.guard';
import { AuthenticatedGuard } from '../src/auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from '../src/auth/common/filters/auth-exceptions.filter';
import { WorkPostServicePG } from './postgres/workpost/pg-workpost.service';
import { OrderServicePG } from './postgres/order/order.service';
import { OrderPageOptionsDTO } from './postgres/order/dto/order-page-options';
import { Order } from '../entities/order.entity';
import { PageMetaDTO } from './postgres/order/dto/page-meta.dto';
import { UserRole } from '../entities/user.entity';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
  constructor(
    private orderServicePG: OrderServicePG,
    private workPostServicePG: WorkPostServicePG,
  ) {}
  @UseGuards(AuthenticatedGuard)
  @Get('/')
  @Render('pg/workpost/monitor')
  async getPgMonitor(@Req() req, @Query() query: OrderPageOptionsDTO) {
    const workPosts = await this.workPostServicePG.findWorkPosts({
      relations: { order: { car: { brand: true, model: true } } },
      order: { number: 'ASC' },
    });

    const orderPageOptions = new OrderPageOptionsDTO(query);
    type FilteredDataPage = { data: Order[]; meta: PageMetaDTO };
    const ordersInQueue: FilteredDataPage = await this.orderServicePG
      .findOrdersPaginate(orderPageOptions)
      .then((orderData) => {
        const { data, meta } = orderData;
        const filteredData = data.filter(
          (order) => order.orderStatus === 'opened' && order.workPost === null,
        );
        return { data: filteredData, meta };
      });
    const isAdmin = req.user.roles.includes(UserRole.ADMIN);
    return {
      workPosts,
      ordersInQueue,
      isAdmin,
    };
  }

  @Get('/test')
  test(@Res() res: Response) {
    return res.status(200).json({ message: 'OK' });
  }

  @Get('/login')
  @Render('auth/auth')
  index(
    @Req() req,
    @Res() res: Response,
  ): { message: string; loginPage: boolean } | void {
    if (req.isAuthenticated()) {
      return res.redirect('/pgmonitor');
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
      path: '/',
      httpOnly: true,
      maxAge: 0,
      expires: new Date(0),
    });
    return res.redirect('/login');
  }
}

export default AppController;
