import { Test, TestingModule } from '@nestjs/testing';
import { CarControllerPG } from './car.controller';
import { CarServicePG } from './car.service';
import { DataSource } from 'typeorm';
import { CarModelServicePG } from '../car-model/car-model.service';
import { ClientServicePG } from '../client/pg-client.service';
import mockCarServicePG from './__mocks__/car.service';
import { carStub } from './test/car.stub';

describe('Car controller', () => {
  let carControllerPG: CarControllerPG;
  let carServicePG: CarServicePG;
  const mockDataSourcePG = {};
  const mockClientServicePG = {};
  const mockCarModelServicePG = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarControllerPG],
      providers: [CarServicePG, DataSource, ClientServicePG, CarModelServicePG],
    })
      .overrideProvider(CarServicePG)
      .useValue(mockCarServicePG)
      .overrideProvider(DataSource)
      .useValue(mockDataSourcePG)
      .overrideProvider(ClientServicePG)
      .useValue(mockClientServicePG)
      .overrideProvider(CarModelServicePG)
      .useValue(mockCarModelServicePG)
      .compile();
    carControllerPG = module.get<CarControllerPG>(CarControllerPG);
    carServicePG = module.get<CarServicePG>(CarServicePG);
  });

  describe('should be findOne', () => {
    it('Should be defined controller', () => {
      expect(carControllerPG).toBeDefined();
    });
    let car;
    beforeEach(async () => {
      car = await carControllerPG.getCar(carStub().id, {});
    });
    it('should be called', () => {
      expect(carServicePG.findCar).toBeCalledWith(carStub().id);
      expect(car).toEqual(carStub().id);
    });
  });
});
