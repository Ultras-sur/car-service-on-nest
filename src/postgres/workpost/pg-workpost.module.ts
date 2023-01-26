import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkPost } from 'entities/workpost.entity';
import { WorkPostServicePG } from './pg-workpost.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkPost])],
  providers: [WorkPostServicePG],
  exports: [WorkPostServicePG],
})
export class WorkPostModulePG {}