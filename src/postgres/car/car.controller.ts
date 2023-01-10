import { Controller, Get, Render, Post, Res, Req, UseGuards, UseFilters, Query, HttpStatus, Body } from '@nestjs/common';
import { ClientServisePG } from '../client/pg-client.service';
import { CarModelServicePG } from '../car-model/car-model.service';
import { CarServicePG } from './car.service';


@Controller('pgcar')
export class CarControllerPG {
  constructor(
    private carServicePG: CarServicePG,
    private clientServicePG: ClientServisePG,
    private carModelServicePG: CarModelServicePG,
  ) {}

  @Get('cars')
  async getCars(@Res() res) {
    const cars = await this.carServicePG.findCars();
    return res.status(HttpStatus.OK).json({ cars });
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
    return res.status(HttpStatus.OK).json({ newCar });
  }
}
