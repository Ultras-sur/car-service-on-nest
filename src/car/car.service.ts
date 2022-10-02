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
    const createdCar =  this.carModel.create(createCarDTO);
    return createdCar;
  }

  async findOwnerCars(ownerId): Promise<Car[]> {
    const ownerCars = await this.carModel.find({ owner: ownerId });
    return ownerCars;
  }

  async findCar(carId): Promise<Car> {
    const car = await this.carModel.findById(carId);
    return car;
  }
}
