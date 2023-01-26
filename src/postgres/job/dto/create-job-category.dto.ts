import { Job } from 'entities/job.entity';

export class CreateJobCategoryDTO {
  readonly name: string;
  readonly jobs?: Job[];
}
