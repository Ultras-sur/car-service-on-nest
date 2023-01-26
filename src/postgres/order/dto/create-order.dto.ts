import { Car } from 'entities/car.entity';
import { Client } from 'entities/client.entity';
import { Job } from 'entities/job.entity';

export class CreateOrderDTO {
  readonly owner: Client;
  readonly car: Car;
  readonly workPost: number;
  readonly jobs: Job[];
}
