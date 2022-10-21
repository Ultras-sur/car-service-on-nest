import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from 'schemas/job.schema';
import { JobCategory, JobCategorySchema } from 'schemas/job-category.schema';
import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
           MongooseModule.forFeature([{ name: JobCategory.name, schema: JobCategorySchema }])],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
