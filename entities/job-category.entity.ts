import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Job } from './job.entity';

@Entity()
export class JobCategory {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public name: string;

  @OneToMany(() => Job, (job: Job) => job.category)
  public jobs: Job[];
}  