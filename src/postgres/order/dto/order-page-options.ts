import { Car } from 'entities/car.entity';
import { Client } from 'entities/client.entity';
import { WorkPost } from 'entities/workpost.entity';

export class OrderPageOptionsDTO {
  readonly name?: Client;
  readonly orderNumber?: string;
}
