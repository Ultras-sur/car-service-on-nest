import {
  Controller,
  Get,
  Render,
  Post,
  Res,
  Req,
  UseGuards,
  UseFilters,
  Query,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { Role } from 'schemas/user.schema';
import { CarModelServicePG } from '../car-model/car-model.service';
import { CreateCarBrandDTO } from './dto/create-car-brand.dto';
import { CreateCarModelDTO } from './dto/create-car-model.dto';

@Controller('pgcarmodel')
export class CarModelControllerPG {
  constructor(private carModelServicePG: CarModelServicePG) { }

  @Get('/')
  @Render('pg/admin/cars-directory')
  async getCarBrands(@Res() res, @Req() req) {
    const carBrandsAndModels = await this.carModelServicePG.findCarBrands({
      relations: { models: true },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { carBrandsAndModels, isAdmin };
  }

  @Get('carbrandsandmodels')
  async getCarbrandsForFetch(@Res() res) {
    const carBrands = await this.carModelServicePG.findCarBrands({
      order: { name: 'ASC' },
    });
    const carModelsAndBrands = {};
    await Promise.all(
      carBrands.map(async (brand) => {
        const findedModels = await this.carModelServicePG.findCarModels({
          where: { brand: brand },
          order: { name: 'ASC' },
        });
        //const modelBrands = findedModels.map(model => model.name);
        const models = findedModels.map((model) => [model.id, model.name]);
        carModelsAndBrands[brand.name] = models;
      }),
    );
    return res.status(HttpStatus.OK).json({ carModelsAndBrands });
  }

  @Post('newbrand')
  async createCarBrand(
    @Body() createCarBrandDTO: CreateCarBrandDTO,
    @Res() res,
  ) {
    const newCarBrand = await this.carModelServicePG.createCarBrand(
      createCarBrandDTO,
    );
    return res.redirect('/pgcarmodel');
  }

  @Post('newmodel')
  async createCarModel(@Body() createCarModel: CreateCarModelDTO, @Res() res) {
    const newCarModel = await this.carModelServicePG.createCarModel(
      createCarModel,
    );
    return res.redirect('/pgcarmodel');
  }
}
