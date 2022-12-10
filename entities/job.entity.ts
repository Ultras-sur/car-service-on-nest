import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { JobCategory } from './job-category.entity';

@Entity()
export class Job {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(() => JobCategory, (category: JobCategory) => category.jobs)
  category: JobCategory;
}  