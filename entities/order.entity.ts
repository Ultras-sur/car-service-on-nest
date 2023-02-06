import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Car } from './car.entity';
import { Client } from './client.entity';
import { Job } from './interfaces/job.interface';
import { WorkPost } from './workpost.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public number: string;

  @Column({ default: new Date() })
  public createdAt: Date;

  @Column({ nullable: true })
  public updatedAt: Date;

  @OneToOne(() => WorkPost, (workPost: WorkPost) => workPost.order)
  public workPost: WorkPost;

  @ManyToOne(() => Car, (car: Car) => car.orders)
  public car: Car;

  @ManyToOne(() => Client)
  public client: Client;

  @Column({ default: 'opened' })
  public orderStatus: string;

  @Column({ type: 'jsonb' })
  public jobs: Job[];
}
