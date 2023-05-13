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
  Delete,
} from '@nestjs/common';
import { ClientServicePG } from '../client/pg-client.service';
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
import { RolesPG } from 'src/auth/roles.decorator';
import { UserRole } from 'entities/user.entity';
import * as fs from 'node:fs';
import busboy = require('busboy');
import * as path from 'path';

@Controller('pgcar')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class CarControllerPG {
  constructor(
    private carServicePG: CarServicePG,
    private clientServicePG: ClientServicePG,
    private carModelServicePG: CarModelServicePG,
    private dataSource: DataSource,
  ) {}

  @Get('/')
  @Render('pg/car/cars')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async getCars(@Res() res, @Req() req, @Query() query: PageOptionsDTO) {
    const pageOptions = new PageOptionsDTO(query);
    const cars = await this.carServicePG.findCarsPaginate(pageOptions);
    const carBrands = await this.carModelServicePG.findCarBrands();
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    const searchString = `${req.url.replace(/\/pgcar\??(page=\d+\&?)?/im, '')}`;
    return { cars, isAdmin, carBrands, searchString };
  }

  @Get(':id')
  @Render('pg/car/car2')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
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
    const imagePath =
      car.imagePath
        ?.split('/')
        .filter((elem) => elem !== 'public')
        .join('/') ?? null;
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { car, imagePath, isAdmin, message: req.flash('message') };
  }

  @Get('createcar/:ownerId')
  @Render('pg/car/create-car')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
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
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
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

  @Post('/upload/:carId')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async uploadCarImage(@Res() res, @Req() req, @Param('carId') carId) {
    const bb = busboy({ headers: req.headers });
    bb.on('file', async (name, file, info) => {
      const { filename } = info;
      if (filename.length === 0) {
        req.flash('message', 'No file selected');
        return res.redirect(`/pgcar/${carId}`);
      }
      const newFileName = `car_${carId}${path.extname(filename)}`;
      const filePath = path.join('car_images', newFileName);
      try {
        const fstream = fs.createWriteStream(path.join('public', filePath));
        file.pipe(fstream);
        await this.carServicePG.findCarAndUpdate(carId, {
          imagePath: filePath,
        });
        req.flash('message', 'OK');
        return res.redirect(`/pgcar/${carId}`);
      } catch (error) {
        req.flash('message', error.message);
        return res.redirect(`/pgcar/${carId}`);
      }
    });
    bb.on('error', (error) => {
      req.flash('message', error);
      return res.redirect(`/pgcar/${carId}`);
    });
    req.pipe(bb);
  }

  @Delete(':carId')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  async deleteCar(@Param('carId') carId: string, @Res() res) {
    const deletedCar = await this.carServicePG.deleteWithTransaction(carId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Car deleted successfully', car: deletedCar });
  }
}
