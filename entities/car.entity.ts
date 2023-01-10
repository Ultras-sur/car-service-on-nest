import { Column, Entity, JoinColumn, OneToOne, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CarBrand } from './car-brand.entity';
import { CarModel } from './car-model.entity';
import { Client } from './client.entity';


@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => CarBrand)
  public brand: CarBrand;

  @ManyToOne(() => CarModel)
  public model: CarModel;

  @Column()
  public releaseYear: number;

  @Column({ unique: true })
  public vin: string;

  @ManyToOne(() => Client, (owner: Client) => owner.cars)
  public owner: Client;
}
