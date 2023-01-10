import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from 'entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDTO } from './dto/createClient.dto';

@Injectable()
export class ClientServisePG {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}

  async findAll(condition = {}): Promise<Client[]> {
    return this.clientRepository.findBy(condition);
  }
  async findClient(id): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }
    return client;
  }

  async createClient(clientData: CreateClientDTO): Promise<Client> {
    const newClient = this.clientRepository.create(clientData);
    await this.clientRepository.save(newClient);
    return newClient;
  }
}
