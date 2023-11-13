import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CarModel } from '../../../entities/car-model.entity';
import { CarBrand } from '../../../entities/car-brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarBrandDTO } from './dto/create-car-brand.dto';
import { CreateCarModelDTO } from './dto/create-car-model.dto';

@Injectable()
export class CarModelServicePG {
  constructor(
    @InjectRepository(CarBrand)
    private carBrandRepository: Repository<CarBrand>,
    @InjectRepository(CarModel)
    private carModelRepository: Repository<CarModel>,
  ) {}

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

  async findCarBrand(condition = {}) {
    const findedCarBrand = await this.carBrandRepository.findOneBy(condition);
    return findedCarBrand;
  }

  async findCarBrandById(id) {
    const findedCarBrand = await this.carBrandRepository.findOne({
      where: { id },
    });
    return findedCarBrand;
  }

  async findCarBrands(condition = {}): Promise<CarBrand[]> {
    const findedCarBrand = await this.carBrandRepository.find({
      order: { name: 'ASC' },
      ...condition,
    });
    return findedCarBrand;
  }

  async findCarModel(condition = {}) {
    const findedCarModel = await this.carModelRepository.findOneBy(condition);
    return findedCarModel;
  }

  async findCarModelById(id) {
    const findedCarModel = await this.carModelRepository.findOne({
      where: { id },
    });
    return findedCarModel;
  }

  async findCarModels(condition = {}) {
    const findedCarModels = await this.carModelRepository.find(condition);
    return findedCarModels;
  }
}
