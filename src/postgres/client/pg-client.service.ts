import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Client } from 'entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDTO } from './dto/createClient.dto';
import { ClientPageMetaDTO } from './dto/client-page-meta.dto';
import { ClientPageDTO } from './dto/client-page.dto';

@Injectable()
export class ClientServisePG {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}

  async findClientsPaginate(clientPageOptions): Promise<ClientPageDTO<Client>> {
    const clientsAndCount = await this.clientRepository.findAndCount({
      where: {
        licensNumber: clientPageOptions.licensNumber
          ? ILike(`%${clientPageOptions.licensNumber}%`)
          : null,
        name: clientPageOptions.name
          ? ILike(`%${clientPageOptions.name}%`)
          : null,
      },
      order: { name: clientPageOptions.order },
      take: clientPageOptions.take,
      skip: clientPageOptions.skip,
    });
    const [clients, clientsCount] = clientsAndCount;
    const clientMeta = new ClientPageMetaDTO(clientsCount, clientPageOptions);
    return new ClientPageDTO(clients, clientMeta);
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
