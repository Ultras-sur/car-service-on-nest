import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientService } from './client.service';
import { CarService } from '../car/car.service';
import { CarModule } from '../car/car.module';
import { Client, ClientSchema } from '../../schemas/client.schema';
import { ClientController } from './client.controller';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    forwardRef(() => CarModule),
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})

export class ClientModule { }

