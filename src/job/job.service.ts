import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from 'schemas/job.schema';
import { JobCategory, JobCategoryDocument } from 'schemas/job-category.schema';
import { CreateJobDTO } from 'dto/create-job.dto';
import { CreateJobCategoryDTO } from 'dto/create-job-category.dto';

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<JobDocument>, @InjectModel(JobCategory.name) private readonly jobCategoryModel: Model<JobCategoryDocument>) {}

  async createJob(createJobDTO: CreateJobDTO): Promise<Job> {
    const createdJob = new this.jobModel(createJobDTO);
    return createdJob.save();
  }

  async createCategory(createCategoryDTO: CreateJobCategoryDTO): Promise<JobCategory> {
    const createdCategyJob = new this.jobCategoryModel(createCategoryDTO);
    return createdCategyJob.save();
  }

  async findJob(jobId): Promise<Job> {
    const job = await this.jobModel.findById(jobId);
    return job;
  }

  async findJobs(condition = {}): Promise<Job[]> {
    const jobs = await this.jobModel.find(condition);
    return jobs;
  }

  async findCategories(): Promise<JobCategory[]> {
    const categories = await this.jobCategoryModel.find();
    return categories;
  }
}
