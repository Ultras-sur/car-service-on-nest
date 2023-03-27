import { Client } from 'entities/client.entity';
import { OrderEnum } from 'entities/dto/order.enum';
import { WorkPost } from 'entities/workpost.entity';

export class OrderPageOptionsDTO {
  readonly name?: Client;
  readonly orderNumber?: string;
  readonly workPost?: WorkPost;
  readonly order?: OrderEnum = OrderEnum.ASC;
  readonly page?: number;
  readonly take?: number = 10;
  get skip(): number {
    return (this.page - 1) * this.take;
  }

  constructor(query) {
    this.name = query.name ?? null;
    this.orderNumber = query.orderNumber ?? null;
    this.workPost = query.workPost ?? null;
    this.page = query.page ?? 1;
  }
}
