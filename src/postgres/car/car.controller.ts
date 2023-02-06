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
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientServisePG } from '../client/pg-client.service';
import { CarModelServicePG } from '../car-model/car-model.service';
import { CarServicePG } from './car.service';
import { Role } from 'schemas/user.schema';
import { DataSource, Like } from 'typeorm';
import { Car } from 'entities/car.entity';
import { PageOptionsDTO } from './dto/page-options.dto';
import { CreateCarDTO } from './dto/create-car.dto';

@Controller('pgcar')
export class CarControllerPG {
  constructor(
    private carServicePG: CarServicePG,
    private clientServicePG: ClientServisePG,
    private carModelServicePG: CarModelServicePG,
    private dataSource: DataSource,
  ) { }

  @Get('cars')
  @Render('pg/car/cars')
  async getCars(@Res() res, @Req() req, @Query() query: PageOptionsDTO) {
    const pageOptions = new PageOptionsDTO(query);
    const cars = await this.carServicePG.findCarsPaginate(pageOptions);
    const carBrands = await this.carModelServicePG.findCarBrands();
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    const searchString = `${req.url.replace(
      /\/pgcar\/cars\??(page=\d+\&?)?/im,
      '',
    )}`;
    return { cars, isAdmin, carBrands, searchString };
  }

  @Get(':id')
  @Render('pg/car/car')
  async getCar(@Param('id') carId, @Req() req) {
    const car = await this.dataSource
      .getRepository(Car)
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.owner', 'owner')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.orders', 'orders')
      .where('car.id = :id', { id: carId })
      .getOne();
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { car, isAdmin };
  }

  @Get('createcar/:ownerId')
  @Render('pg/car/create-car')
  async getCreteCarForm(@Param('ownerId') ownerId, @Req() req) {
    const owner = { id: ownerId };
    const carBrands = await this.carModelServicePG.findCarBrands({
      order: { name: 'ASC' },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { owner, carBrands, isAdmin };
  }

  @Post('createcar')
  async createCar(@Res() res, @Body() createCarDTO: CreateCarDTO) {
    const carOwner = await this.clientServicePG.findClient(createCarDTO.owner);
    const carBrand = await this.carModelServicePG.findCarBrandById(
      createCarDTO.brand,
    );
    const carModel = await this.carModelServicePG.findCarModelById(
      createCarDTO.model,
    );
    const newCar = await this.carServicePG.createCar({
      owner: carOwner,
      brand: carBrand,
      model: carModel,
      releaseYear: createCarDTO.releaseYear,
      vin: createCarDTO.vin,
    });
    return res.redirect(`${newCar.id}`);
  }
}
