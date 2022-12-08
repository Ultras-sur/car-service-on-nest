import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Client, ClientDocument } from 'schemas/client.schema';
import { Car } from 'schemas/car.schema';
import { CarService } from 'src/car/car.service';
import { CreateClientDTO } from 'dto/create-client.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';


@Injectable()
export class ClientService {
  constructor(@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection, private carService: CarService) { }

  async create(createClientDTO: CreateClientDTO): Promise<Client> {
    const createdClient = new this.clientModel(createClientDTO);
    return createdClient.save();
  }

  async findAll(page, step, sortCondition = {}, findCondition = {}) {
    const clients = await this.clientModel.find(findCondition, null, {
      limit: step,
      skip: step * (page - 1)
    })
      .sort(sortCondition);
    const totalPages = Math.ceil(clients.length / step);
    return { clients, totalPages, page, step };
  }

  async find(condition): Promise<Client[]> {
    const clients = await this.clientModel.find(condition);
    return clients;
  }

  async findOne(clientId): Promise<Client> {
    return this.clientModel.findById(clientId).exec();
  }

  async editClient(clientId, createClientDTO: CreateClientDTO): Promise<Client> {
    return this.clientModel
      .findByIdAndUpdate(clientId, createClientDTO, { new: true });
  }

  async deleteClient(clientId: string, clientCars: Car[]): Promise<Client> {
    const session = await this.connection.startSession();
    let deletedUser;
    await session.withTransaction(async () => {
      deletedUser = await this.clientModel.findByIdAndDelete(clientId);
      if (!deletedUser) {
        throw new NotFoundException('Client does not exist!');
      }
      const carIds = clientCars.map(car => car['_id'].toString());
      console.log(carIds);
      await this.carService.deleteMany(carIds, session);
    })
    session.endSession();
    return deletedUser;
  }
}


