import { ClientPageMetaDTO } from './client-page-meta.dto';

export class ClientPageDTO<T> {
  readonly data: T[];
  readonly meta: ClientPageMetaDTO;

  constructor(data: T[], meta: ClientPageMetaDTO) {
    this.data = data;
    this.meta = meta;
  }
}
