import { JobCategory } from 'entities/job-category.entity';

export class CreateJobDTO {
  readonly name: string;
  readonly category: JobCategory;
}