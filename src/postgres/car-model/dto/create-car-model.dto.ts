import { CarBrand } from "entities/car-brand.entity";
export class CreateCarModelDTO {
  readonly name: string;
  readonly brand: CarBrand;
}