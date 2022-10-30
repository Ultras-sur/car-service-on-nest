import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../../schemas/order.schema';
import { CreateOrderDTO } from '../../dto/create-order.dto';
import { UpdateOrderDTO } from '../../dto/update-order.dto';
import { UpdateOrderWorkPostDTO } from '../../dto/update-order-workpost.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';


@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }

  async findCarOrders(carId): Promise<Order[]> {
    const carOrders = await this.orderModel.find({ car: carId });
    return carOrders;
  }

  async findOrder(orderId): Promise<Order> {
    const order = this.orderModel.findById(orderId);
    return order;
  }

  async findOrderPopulate(orderId) {
    const order = this.orderModel.findById({ _id: orderId })
      .populate('car')
      .populate('client');
    return order;
  }

  async findOrdersByConditionPopulate(condition) {
    const orders = this.orderModel.find(condition)
      .populate('car')
      .populate('client');
    return orders;
  }

  async findOrderByCondition(condition): Promise<Order> {
    const order = this.orderModel.findOne(condition);
    return order;
  }

  async findOrdersByConditionPaginate(condition, page, step = 8) {
    const orders = await this.orderModel.find(condition, null, {
      limit: step,
      skip: step * (page - 1)
    }).populate('car');
    const totalDocuments = await this.orderModel.find(condition).countDocuments();
    const totalPages = Math.ceil(totalDocuments / step);
    return { orders, totalPages, page, step, totalDocuments };
  }

  async findOrders(condition = {}): Promise<Order[]> {
    const orders = this.orderModel.find(condition);
    return orders;
  }

  async create(createOrderDTO: CreateOrderDTO): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDTO);
    return createdOrder.save();
  }

  async update(id, updateOrderDTO): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate({ _id: id }, { ...updateOrderDTO, updatedAt: Date.now() }, { new: true });
    return updatedOrder;
  }

  async delete(id): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id);
    return deletedOrder;
  }

  async showAll(page: number, step, sortCondition = {}, findCondition = {}) {
    let ordernumber: Partial<{} & string> = {};
    if (findCondition.hasOwnProperty('number')) {
      ordernumber['number'] = findCondition['number'];
    }
    let clientName: Partial<{} & { name: string }> = {};
    if (findCondition.hasOwnProperty('client')) {
      clientName = { name: findCondition['client'] };
    }

    const orders = await this.orderModel.find({ ...ordernumber }, null, {
      limit: step,
      skip: step * (page - 1),
    })
      .populate('car')
      .populate('client')
      .sort(sortCondition);
    if (clientName.hasOwnProperty('name')) {
      const regexp = new RegExp(clientName.name, 'gmi');
      const findedClientOrders = orders.filter(order =>
        regexp.exec(order.client.name.toString()) !== null);
      const totalPages = Math.ceil(findedClientOrders.length / step);
      return { orders: findedClientOrders, totalPages, page, step };
    }

    const totalDocuments = await this.orderModel.find({ ...ordernumber }).countDocuments();
    const totalPages = Math.ceil(totalDocuments / step);
    return { orders, totalPages, page, step };
  }
}

