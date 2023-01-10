import { CarBrand } from 'entities/car-brand.entity';
import { CarModel } from 'entities/car-model.entity';
import { Client } from 'entities/client.entity';

export class CreateCarDTO {
  readonly brand: CarBrand;
  readonly model: CarModel;
  readonly owner: Client;
  readonly vin: string;
  readonly releaseYear: number;
}
