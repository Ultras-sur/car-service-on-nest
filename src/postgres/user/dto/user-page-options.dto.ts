import { OrderEnum } from '../../../../entities/dto/order.enum';
import { UserRole } from '../../../../entities/user.entity';

export class UserPageOptionsDTO {
  readonly login?: string;
  readonly name?: string;
  readonly roles?: UserRole[];
  readonly page?: number;
  readonly take?: number;
  readonly roles_choosed?: boolean;
  readonly order: OrderEnum = OrderEnum.ASC;
  get skip(): number {
    return (this.page - 1) * this.take;
  }
  private getRoles(roles) {
    if (!roles) return null;
    if (Array.isArray(roles)) return roles;
    if (roles.length === 0) return null;
    return [roles];
  }

  constructor(query) {
    this.page = query.page ?? 1;
    this.name = query.name ?? null;
    this.login = query.login ?? null;
    this.roles = this.getRoles(query.roles);
    this.roles_choosed = query.roles_choosed === 'true' ? true : false;
    this.take = query.take ?? 10;
  }
}
