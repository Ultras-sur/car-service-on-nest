import { OrderEnum } from 'entities/dto/order.enum';
import { UserRole } from 'entities/user.entity';

export class UserPageOptionsDTO {
  readonly login?: string;
  readonly name?: string;
  readonly roles?: UserRole[];
  readonly page?: number;
  readonly take?: number = 2;
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
  }
}
