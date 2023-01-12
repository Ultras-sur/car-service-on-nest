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
    const carBrands = await this.carModelServicePG.getAllCarBrands();
    const carBrandsAndModels = {};
    await Promise.all(carBrands.map(async (brand) => {
      const findedModels = await this.carModelServicePG.findCarModels({ where: { brand } });
      const modelNames = findedModels.map(model => model.name);
      carBrandsAndModels[brand.name] = modelNames;
    }))
    return res.status(HttpStatus.OK).json({ carBrandsAndModels });
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