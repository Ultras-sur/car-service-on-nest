import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { JobCategory } from './job-category.entity';

@Entity()
export class Job {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public name: string;

  @ManyToOne(() => JobCategory, (category: JobCategory) => category.jobs)
  public category: JobCategory;
}  