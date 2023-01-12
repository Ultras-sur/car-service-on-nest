import { Controller, Get, Render, Post, Res, Req, UseGuards, UseFilters, Query, HttpStatus, Body, Param } from '@nestjs/common';
import { ClientServisePG } from '../client/pg-client.service';
import { CarModelServicePG } from '../car-model/car-model.service';
import { CarServicePG } from './car.service';
import { Role } from 'schemas/user.schema';


@Controller('pgcar')
export class CarControllerPG {
  constructor(
    private carServicePG: CarServicePG,
    private clientServicePG: ClientServisePG,
    private carModelServicePG: CarModelServicePG,
  ) { }

  @Get('cars')
  async getCars(@Res() res,) {
    const cars = await this.carServicePG.findCars();
    return res.status(HttpStatus.OK).json({ cars });
  }

  @Get(':id')
  @Render('pg/car/car')
  async getCar(@Param('id') carId) {
    const car = await this.carServicePG.findCar(carId);
    const owner = await this.clientServicePG.findClient(car.owner);
    return { car, owner };
  }

  @Get('createcar/:ownerId')
  @Render('pg/car/create-car')
  async getCreteCarForm(@Param('ownerId') ownerId, @Req() req) {
    const owner = { id: ownerId };
    const carBrands = await this.carModelServicePG.findCarBrands({ order: { name: "ASC" } });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { owner, carBrands, isAdmin };
  }

  @Post('createcar')
  async createCar(@Res() res, @Body() carData) {
    const carOwner = await this.clientServicePG.findClient(carData.owner);
    const carBrand = await this.carModelServicePG.findCarBrand(carData.brand);
    const carModel = await this.carModelServicePG.findCarModel(carData.model);
    const newCar = await this.carServicePG.createCar({
      owner: carOwner,
      brand: carBrand,
      model: carModel,
      releaseYear: carData.releaseYear,
      vin: carData.vin,
    });
    return res.redirect(`${newCar.id}`)
    //return res.status(HttpStatus.OK).json({ newCar });
  }
}
