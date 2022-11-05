import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from '../../schemas/car.schema';
import { CreateCarDTO } from '../../dto/create-car.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';


@Injectable()

export class CarService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) { }

  async create(createCarDTO: CreateCarDTO): Promise<Car> {
    const createdCar = this.carModel.create(createCarDTO);
    return createdCar;
  }

  async deleteCar (carId): Promise<Car> {
    const deletedCar = await this.carModel.findByIdAndDelete(carId);
    return deletedCar;
  }

  async findOwnerCars(ownerId): Promise<Car[]> {
    const ownerCars = await this.carModel.find({ owner: ownerId });
    return ownerCars;
  }

  async findCar(carId): Promise<Car> {
    const car = await this.carModel.findById(carId);
    return car;
  }

  async findAllPaginate(page, step, condition = {}, sortCondition = {}) {
    const cars = await this.carModel.find(condition, null, {
      limit: step,
      skip: step * (page - 1),
    })
      .populate('owner')
      .sort(sortCondition);
    const totalDocuments = await this.carModel.find(condition).countDocuments();
    const totalPages = Math.ceil(totalDocuments / step);
    return { cars, step, totalPages, page };
  }
}
