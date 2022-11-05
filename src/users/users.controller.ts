import { Controller, Get, Render, Res, Req, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Redirect, UseGuards, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { Role } from 'schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
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

  @Get('update')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)  
  async updateUser(@Res() res) {
    const updatedUser = await this.usersService.updateUser('6347ddc393c05ea682542283', {  name: 'Admin'});
    return res.redirect('/users');
  }  
       

  @Post('/create')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async create() {
    const user = await this.usersService.create({ email: 'man', password: '000999', roles: ['manager'] });
    return user;
  }

  @Post('/delete')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async delete(@Query('id') id, @Res() res) {
    const deletedUser = await this.usersService.deleteUser(id);
    return res.status(HttpStatus.OK).json({
      deletedUser,
      message: 'User is deleted!'
    });
  }  
}
