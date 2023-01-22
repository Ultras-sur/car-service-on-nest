import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ClientControllerPG } from './pg-client.controller';
import { ClientServisePG } from './pg-client.service';
import { Client } from 'entities/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModulePG } from '../car/car.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), forwardRef(() => CarModulePG)],
  controllers: [ClientControllerPG],
  providers: [ClientServisePG],
  exports: [ClientServisePG],
})
export class ClientModulePG {}
