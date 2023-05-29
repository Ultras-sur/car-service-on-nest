import { MockFactory, Test, TestingModule } from '@nestjs/testing';
import { OrderServicePG } from '../order/order.service';
import { CarServicePG } from './car.service';
import { DataSource, Entity, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Car } from '../../../entities/car.entity';
import { carStub } from './test/car.stub';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
  find: jest.fn((entity) => entity),
}));

describe('CarService', () => {
  let carServicePG: CarServicePG;
  let repositoryMock: MockType<Repository<Car>>;
  const mockOrderServicePG = {};
  const mockDataSource = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataSource,
        OrderServicePG,
        CarServicePG,
        { provide: getRepositoryToken(Car), useFactory: repositoryMockFactory },
      ],
    })
      .overrideProvider(DataSource)
      .useValue(mockDataSource)
      .overrideProvider(OrderServicePG)
      .useValue(mockOrderServicePG)
      .compile();
    carServicePG = module.get(CarServicePG);
    repositoryMock = module.get(getRepositoryToken(Car));
  });

  afterEach(() => {});

  it('should be defined', () => {
    expect(carServicePG).toBeDefined();
  });

  it('should be find car/cars', async () => {
    repositoryMock.findOne.mockReturnValue(carStub());
    repositoryMock.find.mockReturnValue([carStub()]);
    expect(await carServicePG.findCar(carStub())).toEqual(carStub());
    expect(repositoryMock.findOne).toHaveBeenCalledWith(carStub());
    expect(await carServicePG.findCars({})).toEqual([carStub()]);
    expect(repositoryMock.find).toHaveBeenCalledWith({});
  });
});
