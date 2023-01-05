import { Controller, Get, Render, Post, Res, Req, UseGuards, UseFilters, Query, HttpStatus } from '@nestjs/common';
import { CarModelServicePG } from '../car-model/car-model.service';


@Controller('pgcarmodel')
export class CarModelControllerPG {
  constructor(private carModelService: CarModelServicePG) {}

  @Get('createcarbrand')
  async createCarModel(@Res() res) {
    const newCarBrand = await this.carModelService.createCarBrand({ name: 'TOYOTA' });
    return res.status(HttpStatus.OK).json(newCarBrand);
  }
}