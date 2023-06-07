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
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '../../../entities/user.entity';
import { Role } from '../../../schemas/user.schema';
import { AuthExceptionFilter } from '../../../src/auth/common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from '../../../src/auth/common/guards/authenticated.guard';
import { RolesGuard } from '../../../src/auth/common/guards/roles.guard';
import { RolesPG } from '../../../src/auth/roles.decorator';
import { OrderServicePG } from '../order/order.service';
import { WorkPostServicePG } from '../workpost/pg-workpost.service';

@Controller('pgworkpost')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class WorkPostControllerPG {
  constructor(
    private workPostServicePG: WorkPostServicePG,
    private orderServicePG: OrderServicePG,
  ) {}

  @Get('/')
  @Render('pg/workpost/workposts2')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async getWorkPosts(@Req() req) {
    const workPosts = await this.workPostServicePG.findWorkPosts({
      relations: { order: { car: { brand: true, model: true } } },
      order: { number: 'ASC' },
    });
    const ordersInQueue = await this.orderServicePG
      .findOrders({
        relations: { car: { brand: true, model: true }, workPost: true },
        where: { orderStatus: 'opened' },
        order: { createdAt: 'DESC' },
      })
      .then((orders) => orders.filter((order) => order.workPost === null));
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { workPosts, ordersInQueue, isAdmin };
  }

  @Get('res/status')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async getStatusFetch(@Res() res) {
    const workPosts = await this.workPostServicePG.findWorkPosts({
      relations: { order: true },
    });
    return res.status(HttpStatus.OK).json(workPosts);
  }

  @Post('/set')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async setToWorkPost(@Res() res, @Body() workPostData) {
    const { order, workPost } = workPostData;
    const findedOrder = await this.orderServicePG.findOrder({
      where: { id: order },
    });
    const findedWorkPost = await this.workPostServicePG.findWorkPost({
      where: { id: workPost },
    });
    await this.workPostServicePG.setToWorkPost(findedOrder, findedWorkPost);
    return res.redirect('/pgworkpost');
  }

  @Post('unset')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async unsetWorkPost(@Res() res, @Body() workPostData) {
    const { order, workPost, complete } = workPostData;
    const completeCondition =
      complete === 'true' ? { orderStatus: 'closed' } : {};
    const findedOrder = await this.orderServicePG.findOrder({
      where: { id: order },
    });
    const findedWorkPost = await this.workPostServicePG.findWorkPost({
      where: { id: workPost },
    });
    await this.workPostServicePG.unsetWorkPostWhithTransaction(
      findedOrder,
      findedWorkPost.id,
      completeCondition,
    );
    return res.redirect('/pgworkpost');
  }
}
