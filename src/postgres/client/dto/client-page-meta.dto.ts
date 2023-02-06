export class ClientPageMetaDTO {
  readonly page: number;
  readonly take: number;
  readonly totalPages: number;
  readonly clientsCount: number;

  constructor(clientsCount, pageOptions) {
    this.page = pageOptions.page;
    this.take = pageOptions.take;
    this.clientsCount = clientsCount;
    this.totalPages = Math.ceil(this.clientsCount / this.take);
  }
}
