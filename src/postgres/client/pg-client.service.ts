import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';
import { Client } from 'entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDTO } from './dto/createClient.dto';
import { ClientPageMetaDTO } from './dto/client-page-meta.dto';
import { ClientPageDTO } from './dto/client-page.dto';
import { Car } from 'entities/car.entity';
import { Order } from 'entities/order.entity';
import { WorkPost } from 'entities/workpost.entity';

@Injectable()
export class ClientServisePG {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private dataSource: DataSource,
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
    const { licensNumber } = clientData;
    const client = await this.clientRepository.findOne({
      where: { licensNumber },
    });
    if (client) {
      throw new HttpException(
        `Client with licens number ${licensNumber} is already exists!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newClient = this.clientRepository.create(clientData);
    await this.clientRepository.save(newClient);
    return newClient;
  }

  async deleteClientWithTransaction(client: Client): Promise<Client> {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let deletedClient;
    const findedClientCars = await this.dataSource
      .getRepository(Car)
      .find({ where: { owner: client } });
    const findedClientOrders = await this.dataSource
      .getRepository(Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.workPost', 'workPost')
      .where('order.client = :client', { client: client.id })
      .getMany();
    try {
      await Promise.all(
        findedClientOrders.map(async (order) => {
          if (order.workPost !== null) {
            await queryRunner.manager.update(WorkPost, order.workPost, {
              order: null,
            });
          }
          await queryRunner.manager.delete(Order, order.id);
        }),
      );
      await queryRunner.manager.delete(Car, findedClientCars);
      deletedClient = await queryRunner.manager.delete(Client, client);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
    return deletedClient;
  }
}
