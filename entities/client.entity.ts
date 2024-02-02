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
  @PrimaryGeneratedColumn('uuid')
  public id: number;

  @Column({ nullable: true })
  public name: string;

  @Column({ unique: true })
  public licensNumber: string;

  @OneToMany(() => Car, (car: Car) => car.owner)
  @JoinTable()
  public cars: Car[];
}
