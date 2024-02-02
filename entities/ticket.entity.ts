import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { Job } from './job.entity';
import { User } from './user.entity';
import { Car } from './car.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ default: new Date() })
  public createdAt: Date;

  @Column({ type: 'tsrange' })
  public time: string;

  @ManyToOne(() => Client)
  @JoinTable()
  public client: Client;

  @ManyToOne(() => Car)
  @JoinTable()
  public car: Car;

  @Column({ type: 'jsonb' })
  public jobs: Job[];

  @ManyToOne(() => User)
  @JoinTable()
  public user_created: User;
}
