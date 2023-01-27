import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarBrand, CarBrandSchema } from 'schemas/car-brand.schema';
import { CarModel, CarModelSchema } from 'schemas/car-model.schema';
import { CarModelController } from './car-model.controller';
import { CarModelService } from './car-model.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: CarModel.name, schema: CarModelSchema }]),
           MongooseModule.forFeature([{ name: CarBrand.name, schema: CarBrandSchema }])],
  controllers: [CarModelController],
  providers: [CarModelService],
  exports: [CarModelService],
})

export class CarModelModule {}
