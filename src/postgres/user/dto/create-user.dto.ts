import { UserRole } from 'entities/user.entity';

export class CreateUserDTO {
  readonly login: string;
  readonly name: string;
  readonly password: string;
  readonly roles: UserRole[];
}
