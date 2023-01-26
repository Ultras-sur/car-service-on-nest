import {
  Controller,
  Get,
  Render,
  Post,
  Res,
  Req,
  NotFoundException,
  UseGuards,
  UseFilters,
  Query,
  HttpStatus,
  Param,
  Body,
} from '@nestjs/common';
import { Role } from 'schemas/user.schema';
import { JobServicePG } from 'src/postgres/job/pg-job.service';
import { CreateJobCategoryDTO } from './dto/create-job-category.dto';
import { CreateJobDTO } from './dto/create-job.dto';

@Controller('pgjob')
export class JobControllerPG {
  constructor(private jobServicePG: JobServicePG) {}

  @Get('/')
  @Render('pg/admin/jobs-directory')
  async getCategoriesAndJobs(@Res() res, @Req() req) {
    const categoriesAndJobs = await this.jobServicePG.findJobCategories({
      relations: { jobs: true },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { categoriesAndJobs, isAdmin };
  }

  @Get('categoriesandjobs')
  async getCategoriesAndJobsFetch(@Res() res) {
    const allCategories = await this.jobServicePG.findJobCategories();
    const jobsAndCategories = {};
    const categories = {};
    await Promise.all(
      allCategories.map(async (category) => {
        const jobs = await this.jobServicePG.findJobs({
          where: { category: category },
        });
        const jobsList = {};
        await Promise.all(
          jobs.map(async (job) => {
            jobsList[job.id] = job.name;
          }),
        );
        jobsAndCategories[category.id] = jobsList;
      }),
    );
    await Promise.all(
      allCategories.map(async (category) => {
        categories[category.id] = category.name;
      }),
    );
    return res.status(HttpStatus.OK).json({ categories, jobsAndCategories });
  }

  @Post('newcategory')
  async createJobCategory(
    @Body() createJobCategoryDTO: CreateJobCategoryDTO,
    @Res() res,
  ) {
    const newCategory = await this.jobServicePG.createJobCategory(
      createJobCategoryDTO,
    );
    return res.redirect('/pgjob');
  }

  @Post('newjob')
  async createJob(@Body() createJob: CreateJobDTO, @Res() res) {
    const newJob = await this.jobServicePG.createJob(createJob);
    return res.redirect('/pgjob');
  }
}
