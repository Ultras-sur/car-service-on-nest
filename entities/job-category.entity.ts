import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Job } from './job.entity';

@Entity()
export class JobCategory {
  @PrimaryGeneratedColumn('uuid')
  public id: number;

  @Column({ unique: true })
  public name: string;

  @OneToMany(() => Job, (job: Job) => job.category)
  public jobs: Job[];
}
