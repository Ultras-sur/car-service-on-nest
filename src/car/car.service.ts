import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from '../../schemas/car.schema';
import { CreateCarDTO } from '../../dto/create-car.dto';
import { OrderService } from 'src/order/order.service';
import * as mongoose from 'mongoose';
import { deepFlatArray } from 'helpers/deep-flat-array';


@Injectable()

export class CarService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>, private orderService: OrderService) { }

  async create(createCarDTO: CreateCarDTO): Promise<Car> {
    const createdCar = this.carModel.create(createCarDTO);
    return createdCar;
  }

  async findOwnerCars(ownerId): Promise<Car[]> {
    const ownerCars = await this.carModel.find({ owner: ownerId });
    return ownerCars;
  }

  async findCar(carId): Promise<Car> {
    const car = await this.carModel.findById(carId);
    return car;
  }

  async findAllPaginate(page, step, condition = {}, sortCondition = {}) {
    const cars = await this.carModel.find(condition, null, {
      limit: step,
      skip: step * (page - 1),
    })
      .populate('owner')
      .sort(sortCondition);
    const totalDocuments = await this.carModel.find(condition).countDocuments();
    const totalPages = Math.ceil(totalDocuments / step);
    return { cars, step, totalPages, page };
  }


  async deleteCar(carId): Promise<Car> {
    const deletedCar = await this.carModel.findByIdAndDelete(carId);
    return deletedCar;
  }

  async deleteMany(carIds: string[], session: mongoose.ClientSession | null = null): Promise<any> {
    await this.carModel.deleteMany({ _id: carIds }).session(session);
    const carOrdersIds = await Promise.all(carIds.map(async (carId) => {
      const orders = await this.orderService.findOrders({ car: carId });
      const ordersIds = orders.map(order => order['_id'].toString());
      return ordersIds;
    }));

    return this.orderService.deleteMany(deepFlatArray(carOrdersIds), session);
  }
}
