import { Order } from '../../../../src/postgres/car/dto/order.enum';

export class ClientPageOptionsDTO {
  readonly licensNumber?: number;
  readonly name?: string;
  readonly order?: Order.ASC;
  readonly page?: number;
  readonly take?: number = 10;
  get skip(): number {
    return (this.page - 1) * this.take;
  }

  constructor(query) {
    this.licensNumber = query.licensNumber ?? null;
    this.name = query.name ?? null;
    this.page = query.page ?? 1;
  }
}
