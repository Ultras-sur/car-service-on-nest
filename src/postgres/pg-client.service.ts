import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from 'entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDTO } from './dto/createClient.dto';

@Injectable()
export class ClientServisePG {
  constructor(@InjectRepository(Client) private clientRepository: Repository<Client>) { }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }
  async fondOne(id): Promise<Client> {
    const client = await this.clientRepository.findOne(id);
    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }
    return client;
  }

  async createClient() {
    const newClient = this.clientRepository.create({ name: 'Bob', licensNumber: 587458745 });
    await this.clientRepository.save(newClient);
    return newClient;
  }
}
