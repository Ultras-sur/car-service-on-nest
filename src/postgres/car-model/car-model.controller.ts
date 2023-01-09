import { Controller, Get, Render, Post, Res, Req, UseGuards, UseFilters, Query, HttpStatus } from '@nestjs/common';
import { CarModelServicePG } from '../car-model/car-model.service';


@Controller('pgcarmodel')
export class CarModelControllerPG {
  constructor(private carModelService: CarModelServicePG) {}

  @Get('createcarbrand')
  async createCarBrand(@Res() res) {
    const newCarBrand = await this.carModelService.createCarBrand({ name: 'TOYOTA' });
    return res.status(HttpStatus.OK).json(newCarBrand);
  }

  @Get('createcarmodel')
  async createCarModel(@Res() res) {
    const carBrand = await this.carModelService.findCarBrand({ where: { name: 'TOYOTA' }});
    const newCarModel = await this.carModelService.createCarModel({ name: 'ESTIMA', brand: carBrand })
    return res.status(HttpStatus.OK).json(newCarModel);
  }
}