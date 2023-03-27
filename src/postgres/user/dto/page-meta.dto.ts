export class PageMetaDTO {
  readonly page: number;
  readonly take: number;
  readonly totalPages: number;
  readonly usersCount: number;

  constructor(usersCount, pageOptions) {
    this.page = pageOptions.page;
    this.take = pageOptions.take;
    this.usersCount = usersCount;
    this.totalPages = Math.ceil(this.usersCount / this.take);
  }
}
