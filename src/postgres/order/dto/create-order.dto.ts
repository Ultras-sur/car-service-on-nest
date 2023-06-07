import { Car } from '../../../../entities/car.entity';
import { Client } from '../../../../entities/client.entity';
import { Job } from '../../../../entities/interfaces/job.interface';
import { WorkPost } from '../../../../entities/workpost.entity';

export class CreateOrderDTO {
  readonly client: Client;
  readonly car: Car;
  readonly workPost: WorkPost;
  readonly jobs: Job[];
}
