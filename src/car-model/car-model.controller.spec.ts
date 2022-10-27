import { Test, TestingModule } from '@nestjs/testing';
import { CarModelController } from './car-model.controller';

describe('CarModelController', () => {
  let controller: CarModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarModelController],
    }).compile();

    controller = module.get<CarModelController>(CarModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
