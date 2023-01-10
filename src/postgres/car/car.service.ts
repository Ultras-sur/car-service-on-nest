import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Car } from 'entities/car.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarDTO } from './dto/create-car.dto';

@Injectable()
export class CarServicePG {
  constructor(@InjectRepository(Car) private carRepository: Repository<Car>) {}

  async findCars(condition = {}): Promise<Car[]> {
    const cars = await this.carRepository.findBy(condition);
    return cars;
  }

  async createCar(carData: CreateCarDTO): Promise<Car> {
    const newCar = this.carRepository.create(carData);
    await this.carRepository.save(newCar);
    return newCar;
  }
}
