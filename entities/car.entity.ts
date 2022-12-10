import { Column, Entity, JoinColumn, OneToOne, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from './client.entity';


@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public brand: string;
  
  @Column()
  public model: string;

  @Column()
  public releaseYear: number;

  @Column({ unique: true })
  public vin: string;

  @ManyToOne(() => Client, (owner: Client) => owner.cars)
  public owner: Client;
}  