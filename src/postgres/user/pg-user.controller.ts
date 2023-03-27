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
import { UserServicePG } from './pg-user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserPageOptionsDTO } from './dto/user-page-options.dto';

@Controller('pguser')
export class UserControllerPG {
  constructor(private userServicePG: UserServicePG) {}

  @Get('/')
  @Render('pg/admin/users')
  async getUsers(@Req() req, @Query() query) {
    const pageOptions = new UserPageOptionsDTO(query);
    const users = await this.userServicePG.findUsersPaginate(pageOptions);
    const serchString = `${req.url.replace(/\/pguser\??(page=\d+\&?)?/mi, '')}`;
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { users, serchString, isAdmin };
  }

  @Get('create')
  @Render('pg/admin/create-user')
  async getCreateForm(@Req() req) {
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { message: req.flash('message'), isAdmin };
  }

  @Post('/create')
  async create(@Res() res, @Req() req, @Body() userData: CreateUserDTO) {
    console.log(userData)
    try {
      await this.userServicePG.createUser(userData);
      return res.status(HttpStatus.OK).redirect('/');
    } catch (error) {
      req.flash('message', error.message);
      return res.redirect('/pguser/create');
    }
  }
}
