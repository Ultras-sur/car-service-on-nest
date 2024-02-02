import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { Ticket } from 'entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModulePG } from '../car/car.module';
import { ClientModulePG } from '../client/pg-client.module';
import { JobModulePG } from '../job/pg-job.module';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { UserModulePG } from '../user/pg-user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    forwardRef(() => CarModulePG),
    forwardRef(() => ClientModulePG),
    JobModulePG,
    UserModulePG,
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
