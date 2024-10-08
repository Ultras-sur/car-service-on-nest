import { OrderEnum } from 'entities/dto/order.enum';

export class TicketPageOptions {
  readonly day_from?: string;
  readonly day_to?: string;
  readonly time_from?: string;
  readonly time_to?: string;
  readonly page?: number;
  readonly take?: number = 10;
  readonly order?: OrderEnum = OrderEnum.ASC;
  get skip(): number {
    return (this.page - 1) * this.take;
  }
  get date() {
    return `["${this.day_from} ${this.time_from}","${this.day_to} ${this.time_to}"]`;
  }

  constructor(query) {
    function getDateFromAndTo(date) {
      return date.split(' ')[0].split('-').reverse().join('-');
    }

    function getTimeFromAndTo(date) {
      return date.split(' ')[1];
    }

    function getMonth(date) {
      const datePlusMonth = date.setMonth(date.getMonth() + 1);
      return new Date(datePlusMonth);
    }
    //this.day_from = query?.day_from ?? new Date().toISOString().split('T')[0]; //'2024-03-08T19:09:27.832Z'
    //this.day_to = query?.day_to ?? new Date().toISOString().split('T')[0];
    this.day_from = query?.day_from
      ? getDateFromAndTo(query.day_from)
      : new Date().toISOString().split('T')[0];
    /*this.day_to = query?.day_to
      ? getDateFromAndTo(query.day_to)
      : new Date().toISOString().split('T')[0];*/
    this.day_to = query?.day_to
      ? getDateFromAndTo(query.day_to)
      : getMonth(new Date(this.day_from)).toISOString().split('T')[0];
    this.time_from = query?.day_from
      ? getTimeFromAndTo(query.day_from)
      : '00:01';
    this.time_to = query?.day_to ? getTimeFromAndTo(query.day_to) : '23:59';
    this.page = query?.page ?? 1;
  }
}
