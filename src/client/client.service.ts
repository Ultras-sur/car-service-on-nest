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
  async findAll(page, step = 10) {
    const clients = await this.clientModel.find({}, null, {
      limit: step,
      skip: step * (page - 1)
    }) // : Promise<Client[]>
    const totalDocuments = await this.clientModel.find().countDocuments();
    const totalPages = Math.ceil(totalDocuments / step);
    return { clients, totalPages, page, step };
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


