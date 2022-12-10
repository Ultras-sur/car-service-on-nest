import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
  public cars: Car[];
}  