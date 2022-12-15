import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../../schemas/order.schema';
import { CreateOrderDTO } from '../../dto/create-order.dto';
import { WorkPostService } from 'src/workpost/workpost.service';
import * as mongoose from 'mongoose';


@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>, private workPostService: WorkPostService, @InjectConnection() private readonly connection: mongoose.Connection) { }

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
    const session = await this.connection.startSession();
    let createdOrder;
    await session.withTransaction(async () => {
      createdOrder = new this.orderModel(createOrderDTO);
      createdOrder.save();
      if (!createdOrder) throw new NotFoundException('New order is not created!');
      if (createdOrder.workPost !== 'queue') {
        const setOrderToWorkpost = await this.workPostService.setToWorkPost(createdOrder, session);
        if (!setOrderToWorkpost) throw new NotFoundException('New order is not seted to work post!');
      }
    })
    session.endSession();
    return createdOrder;
  }

  async update(id, updateOrderDTO): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate({ _id: id }, { ...updateOrderDTO, updatedAt: Date.now() }, { new: true });
    return updatedOrder;
  }

  async showAll(page: number, step, sortCondition = {}, conditionData = {}) {
    const condition = {};
    if (conditionData.hasOwnProperty('number')) {
      condition['number'] = conditionData['number'];
    }
    if (conditionData.hasOwnProperty('client')) {
      condition['client'] = { $in: conditionData['client'] };
    }
    const orders = await this.orderModel.find(condition, null, {
      limit: step,
      skip: step * (page - 1),
    })
      .populate('car')
      .populate('client')
      .sort(sortCondition);
    const totalDocuments = await this.orderModel.find(condition).countDocuments();
    const totalPages = Math.ceil(totalDocuments / step);
    return { orders, totalPages, page, step };
  }

  async setToWorkPost(orderId, workPost): Promise<Order> {
    let setedOrder;
    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      setedOrder = await this.orderModel.findByIdAndUpdate({ _id: orderId }, { workPost }, { new: true });
      await this.workPostService.setToWorkPost(setedOrder, session);
    });
    session.endSession();
    return setedOrder;
  }

  async unsetWorkPost(orderId, workpost, completeCondition) {
    let unsetedOrder;
    const session = await this.connection.startSession();
     await session.withTransaction(async () => {
       unsetedOrder = await this.orderModel.
         findByIdAndUpdate({ _id: orderId }, { workPost: 'queue', ...completeCondition }, { new: true });
       await this.workPostService.unsetWorkPost(workpost);
     });
    session.endSession();
    return unsetedOrder;
  }

  async delete(id): Promise<Order> {
    let deletedOrder;
    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
      deletedOrder = await this.orderModel.findByIdAndDelete(id);
      if (deletedOrder.workPost !== 'queue') {
        await this.workPostService.unsetWorkPost(deletedOrder.workPost, session);
      }
    })
    return deletedOrder;
  }

  async deleteMany(orderIds: string[], session: mongoose.ClientSession | null = null): Promise<any> {
    const unsetOrdersInWorkPost = await Promise.all(orderIds.map(async orderId => {
      const order = await this.findOrder(orderId);
      if (order.workPost !== 'queue') {
        await this.workPostService.unsetWorkPost(order.workPost, session);
      }
    })) 
    return this.orderModel.deleteMany({ _id: orderIds }).session(session);
  }
}

