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
  @Render('pg/car/cars')
  async getCars(@Res() res, @Req() req) {
    const cars = await this.carServicePG.findCars({
      select: {
        id: true,
        releaseYear: true,
        vin: true,
        brand: true,
        model: true,
        owner: true,
      },
      relations: { brand: true, model: true, owner: true },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { cars, isAdmin, step: 12, totalPages: 1, page: 1 };
    //return res.status(HttpStatus.OK).json({ cars });
  }

  @Get(':id')
  @Render('pg/car/car')
  async getCar(@Param('id') carId, @Req() req) {
    const car = await this.carServicePG.findCar({
      select: {
        brand: true,
        model: true,
        vin: true,
        releaseYear: true,
        owner: true,
      },
      where: { id: carId },
      relation: { brand: true, model: true, owner: true },
    });
    const owner = await this.clientServicePG.findClient(car.owner);
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    console.log(car);
    return { car, owner, isAdmin };
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
    console.log(carData);
    const carOwner = await this.clientServicePG.findClient(carData.owner);
    const carBrand = await this.carModelServicePG.findCarBrandById(carData.brandId);
    const carModel = await this.carModelServicePG.findCarModelById(carData.modelId);
    const newCar = await this.carServicePG.createCar({
      owner: carOwner,
      brand: carBrand,
      model: carModel,
      releaseYear: carData.releaseYear,
      vin: carData.vin,
    });
    return res.redirect(`${newCar.id}`);
    //return res.status(HttpStatus.OK).json({ newCar });
  }
}