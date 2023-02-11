export class UpdateOrderDTO {
  readonly jobs?: { job: string; cost: number }[];
  readonly orderStatus?: string;
}
