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
import { CarServicePG } from '../car/car.service';
import { ClientPageOptionsDTO } from './dto/client-page-options.dto';

@Controller('pgclient')
export class ClientControllerPG {
  constructor(
    private clientServisePG: ClientServisePG,
    private carServicePG: CarServicePG,
  ) {}

  @Get('clients')
  @Render('pg/client/clients')
  async getClients(
    @Res() res,
    @Req() req,
    @Query() query: ClientPageOptionsDTO,
  ) {
    const carPageOptions = new ClientPageOptionsDTO(query);
    const clients = await this.clientServisePG.findClientsPaginate(
      carPageOptions,
    );
    const searchString = `${req.url.replace(
      /\/pgclient\/clients\??(page=\d+\&?)?/im,
      '',
    )}`;
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { clients, isAdmin, searchString };
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
    const client = await this.clientServisePG.findClient(id);
    const cars = await this.carServicePG.findCars({
      select: {
        id: true,
        releaseYear: true,
        vin: true,
        brand: true,
        model: true,
      },
      relations: { brand: true, model: true },
      where: { owner: client },
    });
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { client, isAdmin, cars };
  }

  @Post('create')
  async createClient(@Res() res, @Body() clientData: CreateClientDTO) {
    const newClient = await this.clientServisePG.createClient(clientData);
    if (!newClient) throw new NotFoundException('New client is not created!');
    return res.redirect('getclients');
  }
}
