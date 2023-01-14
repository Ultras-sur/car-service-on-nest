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
} from '@nestjs/common';
import { CarModelServicePG } from '../car-model/car-model.service';


@Controller('pgcarmodel')
export class CarModelControllerPG {
  constructor(private carModelServicePG: CarModelServicePG) { }

  @Get('carbrandsandmodels')
  async getCarbrandsForFetch(@Res() res) {
    const carBrands = await this.carModelServicePG.findCarBrands();
    const carModelsAndBrands = {};
    await Promise.all(
      carBrands.map(async (brand) => {
        const findedModels = await this.carModelServicePG.findCarModels({
          where: { brand: brand },
        });
        //const modelBrands = findedModels.map(model => model.name);
        const models = findedModels.map(model => [model.id, model.name]);
        carModelsAndBrands[brand.name] = models;
      }),
    );
    return res.status(HttpStatus.OK).json({ carModelsAndBrands });
  }

  @Get('createcarbrand')
  async createCarBrand(@Res() res) {
    const newCarBrand = await this.carModelServicePG.createCarBrand({ name: 'TOYOTA' });
    return res.status(HttpStatus.OK).json(newCarBrand);
  }

  @Get('createcarmodel')
  async createCarModel(@Res() res) {
    const carBrand = await this.carModelServicePG.findCarBrand({ name: 'TOYOTA' });
    const newCarModel = await this.carModelServicePG.createCarModel({ name: 'ESTIMA', brand: carBrand })
    return res.status(HttpStatus.OK).json(newCarModel);
  }
}