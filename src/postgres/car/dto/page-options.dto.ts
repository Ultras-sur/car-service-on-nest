import { Order } from './order.enum';

export class PageOptionsDTO {
  readonly brand?: string;
  readonly model?: number;
  readonly releaseYearBefore?: number;
  readonly releaseYearTo?: number;
  readonly vin?: string;
  readonly order?: Order = Order.ASC;
  readonly page?: number;
  readonly take?: number = 10;
  get skip(): number {
    return (this.page - 1) * this.take;
  }

  constructor(query) {
    this.brand = query.brand ?? null;
    this.model = query.model ?? null;
    this.releaseYearBefore = query.releaseYearBefore ?? null;
    this.releaseYearTo = query.releaseYearTo ?? null;
    this.vin = query.vin ?? null;
    this.page = query.page ?? 1;
  }
}
