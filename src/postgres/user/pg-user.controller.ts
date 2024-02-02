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
  Delete,
} from '@nestjs/common';
import { Role } from '../../../schemas/user.schema';
import { UserServicePG } from './pg-user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserPageOptionsDTO } from './dto/user-page-options.dto';
import { AuthExceptionFilter } from '../../../src/auth/common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from '../../../src/auth/common/guards/authenticated.guard';
import { RolesGuard } from '../../../src/auth/common/guards/roles.guard';
import { RolesPG } from '../../../src/auth/roles.decorator';
import { UserRole } from '../../../entities/user.entity';
import { RedisService } from 'src/infrastructure/redis/redis.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('UserController');

@Controller('pguser')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class UserControllerPG {
  constructor(
    private userServicePG: UserServicePG,
    private redisService: RedisService,
  ) {}

  @Get('/')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  @Render('pg/admin/users')
  async getUsers(@Req() req, @Query() query) {
    debug('getUsers');
    const pageOptions = new UserPageOptionsDTO(query);
    const users = await this.userServicePG.findUsersPaginate(pageOptions);
    const serchString = `${req.url.replace(/\/pguser\??(page=\d+\&?)?/im, '')}`;
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    const message = req.flash('message');
    return { message, users, serchString, isAdmin };
  }

  @Get('create')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  @Render('pg/admin/create-user')
  async getCreateForm(@Req() req) {
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    const message = req.flash('message');
    return { message, isAdmin };
  }

  @Get('sessions')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  @Render('pg/admin/sessions')
  async getActiveSessions(@Req() req, @Res() res) {
    const activeClientSessions = await this.redisService.getClientSessions(
      'sess:*',
    );
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    const message = req.flash('message');
    return { activeClientSessions, isAdmin, message };
  }

  @Get('sessions/:id')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  async getSession(@Param('id') sessionId, @Req() req, @Res() res) {
    const sessionInfo = await this.redisService.getSession('sess', sessionId);
    return res.json(sessionInfo);
  }

  @Post('create')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  async create(@Res() res, @Req() req, @Body() userData: CreateUserDTO) {
    try {
      await this.userServicePG.createUser(userData);
      return res.status(HttpStatus.OK).redirect('/');
    } catch (error) {
      req.flash('message', error.message);
      return res.redirect('/pguser/create');
    }
  }
  @Delete('sessions/:id')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  async deleteSession(@Req() req, @Res() res, @Param('id') id: string) {
    try {
      await this.redisService.deleteSession('sess', id);
      return res.status(HttpStatus.OK).redirect(303, '/pguser/sessions'); // 303 for change method to GET
    } catch (error) {
      req.flash('message', error.message);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .redirect(303, '/pguser/sessions'); // 303 for change method to GET
    }
  }
}
