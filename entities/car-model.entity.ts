import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CarBrand } from './car-brand.entity';

@Entity()
export class CarModel {
  @PrimaryGeneratedColumn('uuid')
  public id: number;

  @Column({ unique: true })
  public name: string;

  @ManyToOne(() => CarBrand, (carBrand: CarBrand) => carBrand.models)
  public brand: CarBrand;
}
