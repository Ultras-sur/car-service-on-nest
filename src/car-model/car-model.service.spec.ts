import { Test, TestingModule } from '@nestjs/testing';
import { CarModelService } from './car-model.service';

describe('CarModelService', () => {
  let service: CarModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarModelService],
    }).compile();

    service = module.get<CarModelService>(CarModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
