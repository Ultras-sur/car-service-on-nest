import { Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Redirect } from '@nestjs/common';
import { CarService } from './car.service';
import { ClientService } from '../client/client.service';
import { OrderService } from '../order/order.service';
import { CreateCarDTO } from '../../dto/create-car.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';

@Controller('car')
export class CarController {
  constructor(private carService: CarService, private clientService: ClientService, private orderService: OrderService) { }

  @Get(':id')
  @Render('car/car')
  async findOne(@Param('id', new ValidateObjectId()) id) {
    const car = await this.carService.findCar(id);
    const orders = await this.orderService.findCarOrders(id);
    const client = await this.clientService.findOne(car.owner);
    return { car, client, orders };
  }

  @Get('/create/:ownerId')
  @Render('car/create-car')
  async createCar(@Res() res, @Param('ownerId', new ValidateObjectId()) ownerId) {
    return { client: { _id: ownerId } }
  }

  @Post('new')
  async create(@Res() res, @Body() createCarDTO: CreateCarDTO) {
    const newCar = await this.carService.create(createCarDTO);
    if (!newCar) throw new NotFoundException('New car is not created!');
   return res.redirect(`/car/${newCar['_id']}`);
  }
}