import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CarModel } from 'entities/car-model.entity';
import { CarBrand } from 'entities/car-brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarBrandDTO } from './dto/create-car-brand.dto';
import { CreateCarModelDTO } from './dto/create-car-model.dto';


@Injectable()
export class CarModelServicePG {
  constructor(@InjectRepository(CarModel) private carBrandRepository: Repository<CarBrand>, @InjectRepository(CarModel) private carModelRepository: Repository<CarModel>) { }

  async createCarBrand(carBrand: CreateCarBrandDTO): Promise<CarBrand> {
    const newCarBrand = this.carBrandRepository.create(carBrand);
    await this.carBrandRepository.save(newCarBrand);
    return newCarBrand;
  }

  async createCarModel(carModel: CreateCarModelDTO): Promise<CarModel> {
    const newCarModel = this.carModelRepository.create(carModel);
    await this.carModelRepository.save(newCarModel);
    return newCarModel;
  }


}