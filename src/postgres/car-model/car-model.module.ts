import { Module } from '@nestjs/common';
import { CarBrand } from '../../../entities/car-brand.entity';
import { CarModel } from '../../../entities/car-model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModelServicePG } from './car-model.service';
import { CarModelControllerPG } from './car-model.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CarBrand, CarModel])],
  providers: [CarModelServicePG],
  controllers: [CarModelControllerPG],
  exports: [CarModelServicePG],
})
export class CarModelModulePG {}
