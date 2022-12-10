import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn, Generated, PrimaryColumn, ManyToOne } from 'typeorm';


export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    MANAGER = "MANAGER",
    SUPERADMIN = "SUPERADMIN",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, nullable: true })
  public email: string;

  @Column({ nullable: true })
  public password: string;

  @Column({ type: 'set', enum: UserRole, default:[UserRole.USER], nullable: true })
  roles: UserRole[];
  
}  