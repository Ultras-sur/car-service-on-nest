import { Injectable } from '@nestjs/common';
import { Between, ILike, Repository } from 'typeorm';
import { Car } from 'entities/car.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarDTO } from './dto/create-car.dto';
import { PageOptionsDTO } from './dto/page-options.dto';
import { PageMetaDTO } from './dto/page-meta.dto';
import { PageDTO } from './dto/page.dto';

@Injectable()
export class CarServicePG {
  constructor(@InjectRepository(Car) private carRepository: Repository<Car>) { }

  async findCars(condition = {}): Promise<Car[]> {
    const cars = await this.carRepository.find(condition);
    return cars;
  }

  async findCarsPaginate(pageOptions: PageOptionsDTO): Promise<PageDTO<Car>> {
    const carsAndCount = await this.carRepository.findAndCount({
      select: {
        id: true,
        releaseYear: true,
        vin: true,
      },
      relations: { brand: true, model: true, owner: true },
      where: {
        brand: { name: pageOptions.brand || null },
        model: { id: pageOptions.model || null },
        vin: pageOptions.vin ? ILike(`%${pageOptions.vin}%`) : null,
        releaseYear: Between(
          pageOptions.releaseYearBefore || 0,
          pageOptions.releaseYearTo || new Date().getUTCFullYear(),
        ),
      },
      order: { brand: { name: pageOptions.order } },
      take: pageOptions.take,
      skip: pageOptions.skip,
    });
    const [cars, carsCount] = carsAndCount;
    const pageMeta = new PageMetaDTO(carsCount, pageOptions);
    return new PageDTO(cars, pageMeta);
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
