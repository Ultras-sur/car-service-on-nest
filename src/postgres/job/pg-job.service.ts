import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Job } from '../../../entities/job.entity';
import { JobCategory } from '../../../entities/job-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateJobDTO } from './dto/create-job.dto';
import { CreateJobCategoryDTO } from './dto/create-job-category.dto';

@Injectable()
export class JobServicePG {
  constructor(
    @InjectRepository(JobCategory)
    private jobCategoryRepository: Repository<JobCategory>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,
  ) {}

  async createJobCategory(
    jobCategory: CreateJobCategoryDTO,
  ): Promise<JobCategory> {
    const newJobCategory = this.jobCategoryRepository.create(jobCategory);
    await this.jobCategoryRepository.save(newJobCategory);
    return newJobCategory;
  }

  async createJob(job: CreateJobDTO): Promise<Job> {
    const newJob = this.jobRepository.create(job);
    await this.jobRepository.save(newJob);
    return newJob;
  }

  async findJobCategory(id): Promise<JobCategory> {
    const category = this.jobCategoryRepository.findOne(id);
    return category;
  }

  async findJobCategories(condition = {}): Promise<JobCategory[]> {
    const categories = this.jobCategoryRepository.find(condition);
    return categories;
  }

  async findJob(condition = {}): Promise<Job> {
    const job = this.jobRepository.findOne(condition);
    return job;
  }

  async findJobs(condition = {}): Promise<Job[]> {
    const jobs = this.jobRepository.find(condition);
    return jobs;
  }
}
