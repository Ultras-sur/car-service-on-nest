import { Controller, Get, Render, Res, Req, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Redirect, UseGuards, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { Role } from 'schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';
import { CreateUserDTO } from 'dto/create-user.dto';
import { UpdateUserDTO } from 'dto/update-user.dto';

@Controller('user')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)

export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/')
  @Render('admin/users')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getUsers(@Query('page') page: number, @Query('email') email: string, @Query('roles') roles: [string], @Query('name') name: string, @Req() req) {
    const currentPage = page ?? 1;
    const step = 6;
    const condition = {};
    email ? condition['email'] = email : null;
    name ? condition['name'] = name : null;
    if (roles) {
      Array.isArray(roles) ? condition['roles'] = roles : condition['roles'] = [roles];
    }
    const users = await this.usersService.findUsers(currentPage, step, condition);
    return { ...users, isAdmin: true };
  }

  @Get('/admin/create')
  @Render('admin/create-user')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createUserForm() {
    return { isAdmin: true };
  }

  @Get('/admin/:userId')
  @Render('admin/user')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async user(@Param('userId') userId) {
    const user = await this.usersService.findUser(userId);
    return { user };
  }

  @Post('/admin/create')
  async createUser(@Body() createUserDTO: CreateUserDTO, @Res() res) {
    const createdUser = await this.usersService.create(createUserDTO);
    console.log(createdUser)
    return res.redirect(`/user`);
  }

  @Put('admin/update/:userId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateUser(@Param('userId') userId, @Body() updatedUserDTO: UpdateUserDTO, @Res() res) {
    const updatedUser = await this.usersService.updateUser(userId, updatedUserDTO);
    return res.redirect(`/users/${updatedUser['_id']}`);
  }

  @Delete('admin/delete/:userId')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  async delete(@Param('userId') userId, @Res() res) {
    const deletedUser = await this.usersService.deleteUser(userId);
    return res.status(HttpStatus.OK).json({
      deletedUser,
      message: 'User is deleted!'
    });
  }
}
