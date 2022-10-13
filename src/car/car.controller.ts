import { Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Redirect, UseGuards, UseFilters } from '@nestjs/common';
import { CarService } from './car.service';
import { ClientService } from '../client/client.service';
import { OrderService } from '../order/order.service';
import { CreateCarDTO } from '../../dto/create-car.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { Role } from 'schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';

@Controller('car')
@UseFilters(AuthExceptionFilter)
@UseGuards(RolesGuard)

export class CarController {
  constructor(private carService: CarService, private clientService: ClientService, private orderService: OrderService) { }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  @Render('car/car')
  @Roles(Role.ADMIN, Role.MANAGER)    
  async findOne(@Param('id', new ValidateObjectId()) id) {
    const car = await this.carService.findCar(id);
    const orders = await this.orderService.findCarOrders(id);
    const client = await this.clientService.findOne(car.owner);
    return { car, client, orders };
  }

  @UseGuards(AuthenticatedGuard)  
  @Get('/create/:ownerId')
  @Render('car/create-car')
  @Roles(Role.ADMIN, Role.MANAGER)    
  async createCar(@Res() res, @Param('ownerId', new ValidateObjectId()) ownerId) {
    return { client: { _id: ownerId } }
  }

  @UseGuards(AuthenticatedGuard)  
  @Post('new')
  @Roles(Role.ADMIN, Role.MANAGER)    
  async create(@Res() res, @Body() createCarDTO: CreateCarDTO) {
    const newCar = await this.carService.create(createCarDTO);
    if (!newCar) throw new NotFoundException('New car is not created!');
   return res.redirect(`/car/${newCar['_id']}`);
  }
}