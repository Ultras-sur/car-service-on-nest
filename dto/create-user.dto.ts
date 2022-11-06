export class CreateUserDTO {
  readonly email: string;
  readonly password: string;
  readonly roles: string[];
  readonly name: string;
}