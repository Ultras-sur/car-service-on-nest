import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client, ClientDocument } from '../../schemas/client.schema';
import { CreateClientDTO } from '../../dto/create-client.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';

@Injectable()
export class ClientService {
  constructor(@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>) { }

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

  async find(condition) {
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
  async deleteClient(clientId: String): Promise<Client> {
    return this.clientModel.findByIdAndRemove(clientId);
  }
}


