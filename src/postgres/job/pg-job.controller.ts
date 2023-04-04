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
import { UserRole } from 'entities/user.entity';
import { Role } from 'schemas/user.schema';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from 'src/auth/common/guards/authenticated.guard';
import { RolesGuard } from 'src/auth/common/guards/roles.guard';
import { RolesPG } from 'src/auth/roles.decorator';
import { JobServicePG } from 'src/postgres/job/pg-job.service';
import { CreateJobCategoryDTO } from './dto/create-job-category.dto';
import { CreateJobDTO } from './dto/create-job.dto';

@Controller('pgjob')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class JobControllerPG {
  constructor(private jobServicePG: JobServicePG) {}

  @Get('/')
  @Render('pg/admin/jobs-directory')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  async getCategoriesAndJobs(@Res() res, @Req() req) {
    const categoriesAndJobs = await this.jobServicePG.findJobCategories({
      relations: { jobs: true },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { categoriesAndJobs, isAdmin };
  }

  @Get('categoriesandjobs')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
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
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
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
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  async createJob(@Body() createJob: CreateJobDTO, @Res() res) {
    const newJob = await this.jobServicePG.createJob(createJob);
    return res.redirect('/pgjob');
  }
}
