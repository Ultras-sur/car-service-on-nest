import { Car } from '../../../../entities/car.entity';
import { Client } from '../../../../entities/client.entity';
import { User } from '../../../../entities/user.entity';
import { Job } from '../../../../entities/job.entity';

export class CreateTicketDTO {
  readonly time: string;
  readonly client: Client;
  readonly car: Car;
  readonly user_created: User;
  readonly jobs: Job[];
}
