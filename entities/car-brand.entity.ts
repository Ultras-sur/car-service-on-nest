import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CarModel } from './car-model.entity';

@Entity()
export class CarBrand {
  @PrimaryGeneratedColumn('uuid')
  public id: number;

  @Column({ unique: true, nullable: true })
  public name: string;

  @OneToMany(() => CarModel, (carModel: CarModel) => carModel.brand)
  public models: CarModel[];
  
}  