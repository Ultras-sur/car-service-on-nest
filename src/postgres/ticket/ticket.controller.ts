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

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get('/')
  async getTickets(@Res() res) {
    const tickets = await this.ticketService.findTickets({});
    return res.status(HttpStatus.OK).json({ message: 'OK', tickets });
  }
}
