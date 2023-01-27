import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Car } from './car.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public name: string;

  @Column({ unique: true, nullable: true })
  public licensNumber: number;

  @OneToMany(() => Car, (car: Car) => car.owner)
  @JoinTable()
  public cars: Car[];
}
