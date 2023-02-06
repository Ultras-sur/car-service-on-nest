export class PageMetaDTO {
  readonly page: number;
  readonly take: number;
  readonly totalPages: number;
  readonly ordersCount: number;

  constructor(ordersCount, pageOptions) {
    this.page = pageOptions.page;
    this.take = pageOptions.take;
    this.ordersCount = ordersCount;
    this.totalPages = Math.ceil(this.ordersCount / this.take);
  }
}
