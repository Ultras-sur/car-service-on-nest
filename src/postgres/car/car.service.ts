import { Injectable } from '@nestjs/common';
import { Between, ILike, Repository, DataSource, QueryRunner } from 'typeorm';
import { Car } from 'entities/car.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarDTO } from './dto/create-car.dto';
import { PageOptionsDTO } from './dto/page-options.dto';
import { PageMetaDTO } from './dto/page-meta.dto';
import { PageDTO } from './dto/page.dto';
import { OrderServicePG } from '../order/order.service';

@Injectable()
export class CarServicePG {
  constructor(
    @InjectRepository(Car) private carRepository: Repository<Car>,
    private orderServicePG: OrderServicePG,
    private dataSource: DataSource,
  ) {}

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

  async findCarAndUpdate(carId, condition): Promise<Car> {
    const updatedCar = await this.carRepository
      .createQueryBuilder('car')
      .update(condition)
      .where('id = :id', { id: carId })
      .returning('*')
      .execute()
      .then((res) => res.raw[0]);
    return updatedCar;
  }

  async createCar(carData: CreateCarDTO): Promise<Car> {
    const newCar = this.carRepository.create(carData);
    await this.carRepository.save(newCar);
    return newCar;
  }

  async deleteWithTransaction(carId: string): Promise<Car> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const carOrders = await this.orderServicePG.findOrders({
      relations: { car: true, workPost: true },
      where: { car: { id: carId } },
    });
    let deletedCar;
    try {
      await this.orderServicePG.deleteOrdersWithTransaction(
        carOrders,
        queryRunner,
      );
      deletedCar = await queryRunner.manager.delete(Car, carId);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
    return deletedCar;
  }
}
