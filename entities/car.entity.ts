import { Column, Entity, JoinColumn, OneToOne, ManyToOne, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { CarBrand } from './car-brand.entity';
import { CarModel } from './car-model.entity';
import { Client } from './client.entity';


@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => CarBrand)
  @JoinTable()
  public brand: CarBrand;

  @ManyToOne(() => CarModel)
  @JoinTable()
  public model: CarModel;

  @Column()
  public releaseYear: number;

  @Column({ unique: true })
  public vin: string;

  @ManyToOne(() => Client, (owner: Client) => owner.cars)
  @JoinTable()
  public owner: Client;
}
