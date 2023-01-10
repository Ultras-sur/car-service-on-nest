import {
  Controller,
  Get,
  Render,
  Post,
  Res,
  Req,
  NotFoundException,
  UseGuards,
  UseFilters,
  Query,
  HttpStatus,
  Param,
  Body,
} from '@nestjs/common';
import { ClientServisePG } from './pg-client.service';
import { Role } from 'schemas/user.schema';
import { CreateClientDTO } from './dto/createClient.dto';

@Controller('pgclient')
export class ClientControllerPG {
  constructor(private pgclientService: ClientServisePG) { }

  @Get('getclients')
  @Render('pg/client/clients')
  async getClients(@Res() res, @Req() req) {
    const clients = await this.pgclientService.findAll();
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    console.log(clients);
    return { clients, totalPages: 1, page: 1, step: 20, isAdmin };
  }

  @Get('create')
  @Render('pg/client/create-client')
  getForm(@Req() req): { isAdmin: boolean } {
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { isAdmin };
  }

  @Get(':id')
  @Render('pg/client/client')
  async getClient(@Param('id') id, @Req() req) {
    const client = await this.pgclientService.findClient(id);
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { client, isAdmin };
  }

  @Post('create')
  async createClient(@Res() res, @Body() clientData: CreateClientDTO) {
    const newClient = await this.pgclientService.createClient(clientData);
    if (!newClient) throw new NotFoundException('New client is not created!');
    return res.redirect('getclients');
  }
}
