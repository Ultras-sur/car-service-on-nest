import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'entities/ticket.entity';
import { Repository } from 'typeorm';
import { CreateTicketDTO } from './dto/create-ticket.dto';
import { UserServicePG } from '../user/pg-user.service';

export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    private userService: UserServicePG,
  ) {}

  async findTicket(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    return ticket;
  }

  async findTickets(condition = {}): Promise<Ticket[]> {
    const tickets = await this.ticketRepository.find(condition);
    return tickets;
  }

  async createTicket(ticketData: CreateTicketDTO) {
    const { client, car, user_created, time } = ticketData;
    try {
      const ticket = this.ticketRepository.create({
        client,
        car,
        user_created,
        time,
      });
      await this.ticketRepository.save(ticket);
      return ticket;
    } catch (err) {
      throw new Error(err);
    }
  }

  getTicketByDate(date: string) {
    return this.ticketRepository.query(
      `SELECT * FROM ticket WHERE time && @1::tsrange`,
      [date],
    );
  }

  async deleteTicket(ticketId: string): Promise<Ticket> {
    const deletedTicket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .delete()
      .from(Ticket)
      .where('id = :id', { id: ticketId })
      .returning('*')
      .execute()
      .then((res) => res.raw[0]);

    return deletedTicket;
  }
}
