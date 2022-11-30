import { Controller, Get, Render, Res, Req, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Redirect, UseGuards, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { CarService } from './car.service';
import { ClientService } from '../client/client.service';
import { OrderService } from '../order/order.service';
import { CarModelService } from 'src/car-model/car-model.service';
import { CreateCarDTO } from '../../dto/create-car.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { Role } from 'schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';

@Controller('car')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)

export class CarController {
  constructor(private carService: CarService, private clientService: ClientService, private orderService: OrderService, private carModelService: CarModelService) { }

  @Get('cars')
  @Render('admin/cars')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getCars(@Query('page') page: Number, @Query('releaseYearBefore') releaseYearBefore, @Query('releaseYearTo') releaseYearTo, @Query('brand') brand, @Query('model') model, @Query('vin') vin, @Req() req) {
    const condition = {};
    const releaseYearBeforeCondition = releaseYearBefore ?  { $gte: releaseYearBefore } : { $gte: 0 };
    const releaseYearToCondition = releaseYearTo ? { $lte: releaseYearTo } : { $lte: 2022 };
    condition['releaseYear'] = {...releaseYearBeforeCondition, ...releaseYearToCondition };
    brand ? condition['brand'] = brand : null;
    model ? condition['model'] = model : null;
    vin ? condition['vin'] = new RegExp(vin, 'gmi') : null;
    const currentPage = page ?? 1;
    const step = 10;
    const cars = await this.carService.findAllPaginate(currentPage, step, condition);
    const carBrands = await this.carModelService.findCarBrands({}, { name: 'ASC' });
    const serchString = `${req.url.replace(/\/car\/cars\??(page=\d+\&?)?/mi, '')}`;
    return { ...cars, isAdmin: true, carBrands, serchString };
  }

  @Get('all')
  @Render('car/cars')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getCarsForUser(@Query('page') page: Number, @Query('releaseYear') releaseYear,
    @Query('brand') brand, @Query('model') model, @Query('vin') vin, @Req() req) {
    const condition = {};
    const serchString = `${req.url.replace(/\/car\/all\??(page=\d+\&?)?/mi, '')}`;
    releaseYear ? condition['releaseYear'] = releaseYear : null;
    brand ? condition['brand'] = brand : null;
    model ? condition['model'] = model : null;
    vin ? condition['vin'] = new RegExp(vin, 'gmi') : null;
    const currentPage = page ?? 1;
    const step = 10;
    const cars = await this.carService.findAllPaginate(currentPage, step, condition);
    const carBrands = await this.carModelService.findCarBrands({}, { name: 'ASC' });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { ...cars, isAdmin, carBrands, serchString };
  }




  @Get(':id')
  @Render('car/car')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async findCarInfo(@Param('id', new ValidateObjectId()) id, @Req() req) {
    const car = await this.carService.findCar(id);
    const orders = await this.orderService.findCarOrders(id);
    const client = await this.clientService.findOne(car.owner);
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { car, client, orders, isAdmin };
  }


  @Get('/create/:ownerId')
  @Render('car/create-car')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async createCar(@Param('ownerId', new ValidateObjectId()) ownerId, @Req() req) {
    const carBrands = await this.carModelService.findCarBrands({}, { name: 'ASC' });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { client: { _id: ownerId }, carBrands, isAdmin }
  }


  @Post('new')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(@Res() res: Response, @Body() createCarDTO: CreateCarDTO) {
    const newCar = await this.carService.create(createCarDTO);
    if (!newCar) throw new NotFoundException('New car is not created!');
    return res.redirect(`/car/${newCar['_id']}`);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteCar(@Param('id') carId, @Res() res) {
    const deletedCar = await this.carService.deleteCar(carId);
    return res.status(HttpStatus.OK).json({
      message: "Car has been deleted successfully!",
      car: deletedCar,
    });
  }
}