export class TicketPageMetaDTO {
  readonly page: number;
  readonly take: number;
  readonly totalPages: number;
  readonly ticketCount: number;
  readonly interval: string[];

  constructor(ticketCount, interval, pageOptions) {
    function getFormatInterval(interval) {
      const arrayOfInterval = interval.slice(2, -2).split('","');
      return arrayOfInterval.map((interval) => {
        const [day, time] = interval.split(' ');
        return `${day} ${time}`;
      });
    }
    this.page = pageOptions.page;
    this.take = pageOptions.take;
    this.ticketCount = ticketCount;
    this.totalPages = Math.ceil(this.ticketCount / this.take);
    this.interval = getFormatInterval(interval);
  }
}
