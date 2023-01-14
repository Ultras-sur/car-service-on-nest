import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Car } from 'entities/car.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarDTO } from './dto/create-car.dto';

@Injectable()
export class CarServicePG {
  constructor(@InjectRepository(Car) private carRepository: Repository<Car>) { }

  async findCars(condition = {}): Promise<Car[]> {
    const cars = await this.carRepository.find(condition);
    return cars;
  }

  async findCar(condition = {}): Promise<Car> {
    const car = await this.carRepository.findOne(condition);
    return car;
  }

  async createCar(carData: CreateCarDTO): Promise<Car> {
    const newCar = this.carRepository.create(carData);
    await this.carRepository.save(newCar);
    return newCar;
  }
}
