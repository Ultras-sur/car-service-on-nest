import {
  Controller,
  Get,
  Render,
  Req,
  Query,
  Param,
  Post,
  Res,
  Body,
  HttpStatus,
  Put,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CarServicePG } from '../car/car.service';
import { ClientServicePG } from '../client/pg-client.service';
import { UserServicePG } from '../user/pg-user.service';
import { UserRole } from '../../../entities/user.entity';
import { TicketPageOptions } from './dto/ticket-page-options.dto';
import { CreateTicketDTO } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketController {
  constructor(
    private ticketService: TicketService,
    private carServicePG: CarServicePG,
    private clientServicePG: ClientServicePG,
    private userServicePG: UserServicePG,
  ) {}

  /*@Get('/')
  @Render('pg/tickets/tickets')
  async getTickets(@Res() res, @Req() req) {
    const findedTickets = await this.ticketService.findTickets({
      relations: {
        car: {
          brand: true,
          model: true,
        },
      },
      order: { time: 'ASC' },
    });
    const isAdmin = req.user.roles.includes(UserRole.ADMIN);
    console.log(findedTickets);
    return {
      isAdmin,
      tickets: {
        data: findedTickets,
        meta: {
          take: 10,
          page: 1,
          totalPages: 1,
        },
      },
    };
  }*/

  @Get('/')
  @Render('pg/tickets/tickets')
  async getPaginate(@Res() res, @Req() req, @Query() query: TicketPageOptions) {
    console.log(query);
    const ticketPageOptions = new TicketPageOptions(query);
    const tickets = await this.ticketService.findTicketsPaginate(
      ticketPageOptions,
    );
    const isAdmin = req.user.roles.includes(UserRole.ADMIN);
    console.log(tickets);
    return { tickets, isAdmin, calendar: true };
  }

  @Post('create/:carId')
  async createTicket(
    @Param('carId') carId,
    @Req() req,
    @Res() res,
    @Body() ticket_data,
  ) {
    const car = await this.carServicePG.findCar({
      relations: { owner: true },
      where: { id: carId },
    });
    console.log(ticket_data);
    //const client = await this.clientServicePG.findClient({ id: car.owner.id });
    const userId = req.user.id;
    const user_created = await this.userServicePG.findUser({
      where: {
        id: userId,
      },
    });
    const { day_from, day_to } = ticket_data;
    const createdTicket = await this.ticketService.createTicket({
      car,
      client: car.owner,
      user_created,
      time: `[${day_from}, ${day_to}]`,
      jobs: [],
    });

    if (!user_created || !createdTicket) {
      req.flash('message', 'Ticket is not created.');
      return res.redirect('/');
    }
    return res.redirect('/');
  }
}
