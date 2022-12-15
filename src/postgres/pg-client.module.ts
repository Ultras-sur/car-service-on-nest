import { Module } from '@nestjs/common';
import { ClientControllerPG } from './pg-client.controller';
import { ClientServisePG } from './pg-client.service';
import { Client } from 'entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientControllerPG],
  providers: [ClientServisePG]
})

export class ClientModulePG {}  