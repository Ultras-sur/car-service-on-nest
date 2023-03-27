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
  Delete,
} from '@nestjs/common';
import { ClientServisePG } from '../client/pg-client.service';
import { CarModelServicePG } from '../car-model/car-model.service';
import { CarServicePG } from './car.service';
import { Role } from 'schemas/user.schema';
import { DataSource, Like } from 'typeorm';
import { Car } from 'entities/car.entity';
import { PageOptionsDTO } from './dto/page-options.dto';
import { CreateCarDTO } from './dto/create-car.dto';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from 'src/auth/common/guards/authenticated.guard';
import { RolesGuard } from 'src/auth/common/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('pgcar')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class CarControllerPG {
  constructor(
    private carServicePG: CarServicePG,
    private clientServicePG: ClientServisePG,
    private carModelServicePG: CarModelServicePG,
    private dataSource: DataSource,
  ) { }

  @Get('/')
  @Render('pg/car/cars')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getCars(@Res() res, @Req() req, @Query() query: PageOptionsDTO) {
    const pageOptions = new PageOptionsDTO(query);
    const cars = await this.carServicePG.findCarsPaginate(pageOptions);
    const carBrands = await this.carModelServicePG.findCarBrands();
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    const searchString = `${req.url.replace(/\/pgcar\??(page=\d+\&?)?/im, '')}`;
    return { cars, isAdmin, carBrands, searchString };
  }

  @Get(':id')
  @Render('pg/car/car')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
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
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getCreteCarForm(@Param('ownerId') ownerId, @Req() req) {
    const owner = { id: ownerId };
    const carBrands = await this.carModelServicePG.findCarBrands({
      order: { name: 'ASC' },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { owner, carBrands, isAdmin };
  }

  @Post('createcar')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
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

  @Delete(':carId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteCar(@Param('carId') carId: string, @Res() res) {
    const deletedCar = await this.carServicePG.deleteWithTransaction(carId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Car deleted successfully', car: deletedCar });
  }
}
