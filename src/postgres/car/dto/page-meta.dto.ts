export class PageMetaDTO {
  readonly page: number;
  readonly take: number;
  readonly totalPages: number;
  readonly carsCount: number;

  constructor(carsCount, pageOptions) {
    this.page = pageOptions.page;
    this.take = pageOptions.take;
    this.carsCount = carsCount;
    this.totalPages = Math.ceil(this.carsCount / this.take);
  }
}
