export class CreateOrderDTO {
  readonly number: string;
  readonly car: string;
  readonly client: string;
  readonly jobs: [[string, number]];
  readonly workPost: number;
}