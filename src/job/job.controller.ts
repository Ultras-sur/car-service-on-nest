import { Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Redirect, UseGuards, UseFilters, Req } from '@nestjs/common';
import { JobService } from './job.service';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { Role } from 'schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';
import { CreateJobCategoryDTO } from 'dto/create-job-category.dto';
import { CreateJobDTO } from 'dto/create-job.dto';

@Controller('job')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)

export class JobController {
  constructor(private jobService: JobService) { }


  @Get('/')
  @Render('admin/jobs')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getCategoryesAndJobs(@Res() res) {
    const categories = await this.jobService.findCategories();
    const categoriesAndJobs = await Promise.all(categories.map(async (category) => {
      const findedJobs = await this.jobService.findJobs({ category: category['_id'] });
      return { _id: category['_id'], name: category.name, jobs: findedJobs };
    }));
    //return res.status(HttpStatus.OK).json(categoryesAndJobs);
    return { categoriesAndJobs, isAdmin: true };
  }

  @Get('jobsandcategories')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getJobsAndCategories(@Res() res) {
    const allCategories = await this.jobService.findCategories();
    const jobsAndCategories = {};
    const categories = {};
    await Promise.all(allCategories.map(async category => {
      const jobs = await this.jobService.findJobs({ category: category['_id'] });
      const jobsList = {};
      await Promise.all(jobs.map(async job => {
        jobsList[job['_id']] = job.name;
      }))
      jobsAndCategories[category['id']] = jobsList;
    }))
    await Promise.all(allCategories.map(async category => {
      categories[category['_id']] = category.name;
    })) 

    return res.status(HttpStatus.OK).json({ categories, jobsAndCategories });
  }



  @Post('newcategory')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createJobCategory(@Body() categoryData: CreateJobCategoryDTO, @Res() res) {
    const createdJobCategory = await this.jobService.createCategory(categoryData);
    return res.redirect('/job');
  }

  @Post('newjob')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createJob(@Body() jobData: CreateJobDTO, @Res() res) {
    const createdJob = await this.jobService.createJob(jobData);
    return res.redirect('/job');
  }
}
