import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MANAGER = 'MANAGER',
  SUPERADMIN = 'SUPERADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public login: string;

  @Column()
  public name: string;

  @Column()
  public password: string;

  @Column({
    type: 'text',
    array: true,
    default: [UserRole.USER],
  })
  roles: UserRole[];
}
