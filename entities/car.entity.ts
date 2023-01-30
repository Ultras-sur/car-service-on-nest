import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { CarBrand } from './car-brand.entity';
import { CarModel } from './car-model.entity';
import { Client } from './client.entity';
import { Order } from './order.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  public id: number;

  @ManyToOne(() => CarBrand)
  @JoinTable()
  public brand: CarBrand;

  @ManyToOne(() => CarModel)
  @JoinTable()
  public model: CarModel;

  @Column()
  public releaseYear: number;

  @Column({ unique: true })
  public vin: string;

  @ManyToOne(() => Client, (owner: Client) => owner.cars)
  @JoinTable()
  public owner: Client;

  @OneToMany(() => Order, (order: Order) => order.car)
  public orders: Order[];
}
