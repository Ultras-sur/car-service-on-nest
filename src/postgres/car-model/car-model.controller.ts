import {
  Controller,
  Get,
  Render,
  Post,
  Res,
  Req,
  UseGuards,
  UseFilters,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { UserRole } from '../../../entities/user.entity';
import { AuthExceptionFilter } from '../../../src/auth/common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from '../../../src/auth/common/guards/authenticated.guard';
import { RolesGuard } from '../../../src/auth/common/guards/roles.guard';
import { RolesPG } from '../../../src/auth/roles.decorator';
import { CarModelServicePG } from '../car-model/car-model.service';
import { CreateCarBrandDTO } from './dto/create-car-brand.dto';
import { CreateCarModelDTO } from './dto/create-car-model.dto';

@Controller('pgcarmodel')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class CarModelControllerPG {
  constructor(private carModelServicePG: CarModelServicePG) {}

  @Get('/')
  @Render('pg/admin/cars-directory')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  async getCarBrands(@Res() res, @Req() req) {
    const carBrandsAndModels = await this.carModelServicePG.findCarBrands({
      relations: { models: true },
    });
    const isAdmin = req.user.roles.includes(UserRole.ADMIN);
    return { carBrandsAndModels, isAdmin };
  }

  @Get('carbrandsandmodels')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER)
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
        const models = findedModels.map((model) => [model.id, model.name]);
        carModelsAndBrands[brand.name] = models;
      }),
    );
    return res.status(HttpStatus.OK).json({ carModelsAndBrands });
  }

  @Post('newbrand')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
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
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  async createCarModel(@Body() createCarModel: CreateCarModelDTO, @Res() res) {
    const newCarModel = await this.carModelServicePG.createCarModel(
      createCarModel,
    );
    return res.redirect('/pgcarmodel');
  }
}
