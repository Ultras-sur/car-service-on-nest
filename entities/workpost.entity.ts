import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn, Generated, PrimaryColumn, ManyToOne } from 'typeorm';
import { Car } from './car.entity';
import { Order } from './order.entity';

@Entity()
export class WorkPost {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, nullable: true })
  public number: string;

  @OneToOne(() => Car)
  public car: Car;

  @ManyToOne(() => Order, (order: Order) => order.workPost)
  public order: Order;
  
}  