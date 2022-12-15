import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn, Generated, PrimaryColumn, ManyToOne } from 'typeorm';
import { Car } from './car.entity';
import { Client } from './client.entity';
import { Job } from './interfaces/job.interface';
import { WorkPost } from './workpost.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ unique: true, nullable: true })
  public number: string;

  @Column({ default: new Date(), nullable: true })
  public createdAt: Date;

  @Column()
  public updatedAt: Date;

  @OneToMany(() => WorkPost, (workPost: WorkPost) => workPost.order)
  public workPost: WorkPost;

  @ManyToOne(() => Car)
  public car: Car;

  @ManyToOne(() => Client)
  public client: Client

  @Column({ default: 'opened', nullable: true })
  public orderStatus: string;

  @Column({ type: 'jsonb' })
  public jobs: Job[];
}