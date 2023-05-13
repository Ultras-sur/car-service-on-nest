import { MockFactory, Test, TestingModule } from '@nestjs/testing';
import { OrderServicePG } from '../order/order.service';
import { CarServicePG } from './car.service';
import { DataSource, Entity, Repository } from 'typeorm';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Car } from 'entities/car.entity';
import { Order } from 'entities/order.entity';
import { Connection } from 'mongoose';
import { WorkPost } from 'entities/workpost.entity';
import { WorkPostModulePG } from '../workpost/pg-workpost.module';
import { forwardRef } from '@nestjs/common';
import { WorkPostServicePG } from '../workpost/pg-workpost.service';
import { JobServicePG } from '../job/pg-job.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

describe('CarService', () => {
  let carServicePG: CarServicePG;
  const mockDataSource = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          database: process.env.POSTGRES_TEST_DB,
          host: process.env.POSTGRES_TEST_HOST,
          port: Number(process.env.POSTGRES_TEST_PORT),
          username: process.env.POSTGRES_TEST_USERNAME,
          password: process.env.POSTGRES_TEST_PASSWORD,
          entities: [Car, Order, WorkPost],
        }),
        TypeOrmModule.forFeature([Car, Order, WorkPost]),
      ],
      providers: [
        DataSource,
        OrderServicePG,
        CarServicePG,
        WorkPostServicePG,
        JobServicePG,
      ],
    })
      .overrideProvider(DataSource)
      .useValue(mockDataSource)
      .compile();
    carServicePG = module.get(CarServicePG);
  });

  /*
  afterEach(() => {});
  afterAll(() => {});*/

  it('should be defined', () => {
    expect(carServicePG).toBeDefined();
  });

  /*it('should be find car', async () => {
    const car = {
      id: '313dc852-f8de-4a19-9356-a681d30c2ed5',
      releaseYear: 2017,
      vin: 'fdg45dfgdfrge',
      brandId: 'dfe30365-1812-4a11-b666-740f49574a35',
      modelId: 'ebec930e-0cf9-48e9-8731-ef0c7d387e12',
      ownerId: '35805dfb-d748-46c8-8576-04299fc0d667',
      imagePath: null,
    };
    repositoryMock.findOne.mockReturnValue(car);
    repositoryMock.find.mockReturnValue([car]);
    expect(await carServicePG.findCar(car)).toEqual(car);
    expect(repositoryMock.findOne).toHaveBeenCalledWith(car);
    expect(await carServicePG.findCars({})).toEqual([car]);
    expect(repositoryMock.find).toHaveBeenCalledWith({});
  });*/
});
