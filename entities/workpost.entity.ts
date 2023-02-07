import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class WorkPost {
  @PrimaryGeneratedColumn('uuid')
  public id: number;

  @Column({ unique: true, nullable: true })
  public number: string;

  @OneToOne(() => Order, (order: Order) => order.workPost)
  @JoinColumn()
  public order: Order;
}
