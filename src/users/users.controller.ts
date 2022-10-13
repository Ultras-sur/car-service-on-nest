import { Controller, Post, Get, UseGuards, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { Role } from 'schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
@UseFilters(AuthExceptionFilter)
@UseGuards(RolesGuard)

export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthenticatedGuard)
  @Get('/create')
  @Roles(Role.ADMIN)    
  async create() {
    const user = await this.usersService.create({ email: 'bob', password: '000999', roles: [ 'user'] });
    return user;
  }
}
