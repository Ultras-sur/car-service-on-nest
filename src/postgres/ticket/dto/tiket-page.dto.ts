import { TicketPageMetaDTO } from './ticket-page-meta.dto';

export class TicketPageDTO<T> {
  readonly data: T[];
  readonly meta: TicketPageMetaDTO;

  constructor(data: T[], meta: TicketPageMetaDTO) {
    this.data = data;
    this.meta = meta;
  }
}
