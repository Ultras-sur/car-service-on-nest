import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'entities/ticket.entity';
import { Repository } from 'typeorm';
import { CreateTicketDTO } from './dto/create-ticket.dto';
import { UserServicePG } from '../user/pg-user.service';
import { TicketPageOptions } from './dto/ticket-page-options.dto';
import { TicketPageMetaDTO } from './dto/ticket-page-meta.dto';
import { TicketPageDTO } from './dto/tiket-page.dto';
import { TicketQueryResult } from './dto/ticket--query-result.dto';

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
    const ticketsResultData = await this.ticketRepository.find(condition);
    const tickets = ticketsResultData.reduce((acc, elem) => {
      const ticket = {
        id: elem.id,
        car_id: elem.car.id,
        brand: elem.car.brand.name,
        model: elem.car.model.name,
        releasYear: elem.car.releaseYear,
        time: elem.time,
      };
      acc.push(ticket);
      return acc;
    }, []);
    return tickets;
  }

  async findTicketsPaginate(ticketPageOptions: TicketPageOptions) {
    console.log(
      ticketPageOptions.date,
      ticketPageOptions.skip,
      ticketPageOptions,
    );
    let ticketsAndCount = [];
    ticketsAndCount = await this.getTicketByDateAndCount(
      ticketPageOptions.date,
      ticketPageOptions.take,
      ticketPageOptions.skip,
      ticketPageOptions.order,
    );

    if (!ticketsAndCount) {
      ticketsAndCount = [[], 0, null];
    }
    const [tickets, ticketsCount, interval] = ticketsAndCount;
    const pageMeta = new TicketPageMetaDTO(
      ticketsCount,
      interval,
      ticketPageOptions,
    );
    console.log(pageMeta);
    return new TicketPageDTO(tickets, pageMeta);
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

  async getTicketByDateAndCount(
    interval: string,
    limit = 10,
    offset = 0,
    order = 'ASC',
  ): Promise<[TicketQueryResult[], number, string]> {
    let tickets: TicketQueryResult[];
    let ticketCount: number;
    try {
      tickets = await this.ticketRepository.query(
        `SELECT ticket.id, car.id as car_id, car.brand, car.model, car."releaseYear", time FROM ticket JOIN 
        (SELECT car.id, car."releaseYear", car_brand.name as brand, car_model.name as model from car JOIN car_brand on car."brandId" = car_brand.id JOIN car_model on car."modelId" = car_model.id) as car
        on ticket."carId" = car.id 
        WHERE time && $1::tsrange ORDER BY time ${order} LIMIT ${limit} OFFSET ${offset}`,
        [interval],
      );
      ticketCount = await this.ticketRepository.query(
        `SELECT count(*) from (SELECT ticket.id, car.id as car_id, car.brand, car.model, car."releaseYear", time FROM ticket JOIN 
        (SELECT car.id, car."releaseYear", car_brand.name as brand, car_model.name as model from car JOIN car_brand on car."brandId" = car_brand.id JOIN car_model on car."modelId" = car_model.id) as car
        on ticket."carId" = car.id 
        WHERE time && $1::tsrange) as data`,
        [interval],
      );
    } catch (e) {
      return null;
    }

    return [tickets, ticketCount[0].count, interval];
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
