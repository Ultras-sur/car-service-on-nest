import { carStub } from '../test/car.stub';

const CarService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockRejectedValue(carStub()),
});

export default CarService;
