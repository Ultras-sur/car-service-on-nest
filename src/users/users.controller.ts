import { Controller, Post, Get, UseGuards, UseFilters } from '@nestjs/common';
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

  @Get('/create')
  @UseGuards(RolesGuard)  
  @Roles(Role.ADMIN)  
  async create() {
    const user = await this.usersService.create({ email: 'man', password: '000999', roles: ['manager'] });
    return user;
  }
}
