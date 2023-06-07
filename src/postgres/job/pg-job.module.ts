import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobServicePG } from '../../../src/postgres/job/pg-job.service';
import { JobControllerPG } from '../../../src/postgres/job/pg-job.controller';
import { Job } from '../../../entities/job.entity';
import { JobCategory } from '../../../entities/job-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobCategory])],
  controllers: [JobControllerPG],
  providers: [JobServicePG],
  exports: [JobServicePG],
})
export class JobModulePG {}
