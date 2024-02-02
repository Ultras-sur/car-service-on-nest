import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class TicketList {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'date' })
  public day: Date;

  @Column({ type: 'time' })
  public slots: Date[];

  @Column({ type: 'time' })
  public free_slots: Date[];

  @Column({ type: 'time' })
  public buisy_slots: Date[];
}
