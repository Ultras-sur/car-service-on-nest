import { Controller, Get, Render, Res, Req, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Redirect, UseGuards, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { Role } from 'schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';
import { CarModelService } from './car-model.service';
import { CreateCarBrandDTO } from 'dto/create-car-brand.dto';
import { CreateCarModelDTO } from 'dto/create-car-model.dto';

@Controller('carmodel')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)

export class CarModelController {
  constructor(private carModelService: CarModelService) { }

  @Get('/')
  @Render('admin/cars-directory')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getCarBrandsAndModels() {
    const brands = await this.carModelService.findCarBrands({}, { name: 'ASC' });
    const carBrandsAndModels = await Promise.all(brands.map(async brand => {
      const findedModels = await this.carModelService.findCarModels({ brand: brand['_id'] });
      return { _id: brand['_id'], name: brand.name, models: findedModels };
    }))
    return { isAdmin: true, carBrandsAndModels };
  }

  @Get('carbrandsandmodels')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getModelsForFetchRequest(@Res() res) {
    const carBrands = await this.carModelService.findCarBrands();
    const carModelsAndBrands = {};
    await Promise.all(carBrands.map(async brand => {
      const findedModels = await this.carModelService.findCarModels({ brand: brand['_id'] });
      const modelNames = findedModels.map(model => model.name);
      carModelsAndBrands[brand.name.toString()] = modelNames;
    }));
    return res.status(HttpStatus.OK).json({ carModelsAndBrands });
  }

  @Post('newbrand')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createCarBrand(@Body() brandData: CreateCarBrandDTO, @Res() res) {
    const createdBrand = await this.carModelService.createCarBrand(brandData);
    return res.redirect('/carmodel');
  }

  @Post('newmodel')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createCarModel(@Body() modelData: CreateCarModelDTO, @Res() res) {
    const createdCarModel = await this.carModelService.createCarModel(modelData);
    return res.redirect('/carmodel');
  }
}
