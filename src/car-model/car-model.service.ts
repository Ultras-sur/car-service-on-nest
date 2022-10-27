import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CarBrand, CarBrandDocument } from 'schemas/car-brand.schema';
import { CarModel, CarModelDocument } from 'schemas/car-model.schema';
import { CreateCarBrandDTO } from 'dto/create-car-brand.dto';
import { CreateCarModelDTO } from 'dto/create-car-model.dto';


@Injectable()
export class CarModelService {
  constructor(@InjectModel(CarModel.name) private readonly carModelModel: Model<CarModelDocument>, @InjectModel(CarBrand.name) private readonly carBrandModel: Model<CarBrandDocument>) { }

  async createCarBrand(createCarBrandDTO: CreateCarBrandDTO ) {
    const newCarBrand = new this.carBrandModel(createCarBrandDTO);
    return newCarBrand.save();
  }

  async findCarBrand(brandId): Promise<CarBrand> {
    const carBrand = await this.carBrandModel.findById(brandId);
    return carBrand;
  }

  async findCarBrands(condition = {}, sortCondition = {}): Promise<CarBrand[]> {
    const carBrands = await this.carBrandModel.find(condition).sort(sortCondition);
    return carBrands;
  }

  async createCarModel(createCarModelDTO: CreateCarModelDTO) {
    const newCarModel = new this.carModelModel(createCarModelDTO);
    return newCarModel.save();
  }

  async findCarModel(modelId): Promise<CarModel> {
    const carModel = await this.carModelModel.findById(modelId);
    return carModel;
  }

  async findCarModels(condition = {}) {
    const carModels = await this.carModelModel.find(condition);
    return carModels;
  }
}
