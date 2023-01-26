import { Car } from 'entities/car.entity';
import { Client } from 'entities/client.entity';
import { WorkPost } from 'entities/workpost.entity';

export class CarPageOptionsDTO {
  readonly client?: Client;
  readonly number?: string;
}
