import { CarModel } from "entities/car-model.entity";

export class CreateCarBrandDTO {
  readonly name: string;
  readonly models?: CarModel[];
}