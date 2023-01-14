import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CarBrand } from './car-brand.entity';

@Entity()
export class CarModel {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, nullable: true })
  public name: string;

  @ManyToOne(() => CarBrand, (carBrand: CarBrand) => carBrand.models)
  public brand: CarBrand;
}
