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
  Delete,
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

  @Get('/')
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
      /\/pgclient\??(page=\d+\&?)?/im,
      '',
    )}`;
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { clients, isAdmin, searchString };
  }

  @Get('create')
  @Render('pg/client/create-client')
  getForm(@Req() req) {
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { message: req.flash('message'), isAdmin };
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
  async createClient(
    @Res() res,
    @Req() req,
    @Body() clientData: CreateClientDTO,
  ) {
    try {
      const newClient = await this.clientServisePG.createClient(clientData);
      return res.redirect(`${newClient.id}`);
    } catch (error) {
      req.flash('message', error.message);
      return res.redirect('create');
    }
  }

  @Delete(':clientId')
  async deleteClient(@Res() res, @Param('clientId') clientId) {
    let deletedClient;
    try {
      const findedClient = await this.clientServisePG.findClient(clientId);
      deletedClient = await this.clientServisePG.deleteClientWithTransaction(
        findedClient,
      );
      return res.status(HttpStatus.OK).json({
        message: 'Client successfully deleted',
        client: deletedClient,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
