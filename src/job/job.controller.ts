import { Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Redirect, UseGuards, UseFilters, Req } from '@nestjs/common';
import { JobService } from './job.service';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { Role } from 'schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';
import { CreateJobCategoryDTO } from 'dto/create-job-category.dto';

@Controller('job')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)

export class JobController {
  constructor(private jobService: JobService) { }


  @Get('/')
  @Render('admin/jobs')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getCategoryesAndJobs(@Res() res): Promise<any> {
    const categories = await this.jobService.findCategoryes();
    const categoriesAndJobs = await Promise.all(categories.map(async (category) => {
      const findedJobs = await this.jobService.findJobs({ category: category['_id'] });
      return { name: category.name, jobs: findedJobs };
    }));
    //return res.status(HttpStatus.OK).json(categoryesAndJobs);
    return { categoriesAndJobs, isAdmin: true };
  }

  @Post('newcategory')
  async createJobCategory(@Body() categoryData: CreateJobCategoryDTO, @Res() res) {
    const createdJobCategory = await this.jobService.createCategory(categoryData);
    return res.redirect('/job');
  }
}
