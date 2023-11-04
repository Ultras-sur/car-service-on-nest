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
import { ClientServicePG } from './pg-client.service';
import { Role } from '../../../schemas/user.schema';
import { CreateClientDTO } from './dto/createClient.dto';
import { CarServicePG } from '../car/car.service';
import { ClientPageOptionsDTO } from './dto/client-page-options.dto';
import { AuthExceptionFilter } from '../../../src/auth/common/filters/auth-exceptions.filter';
import { AuthenticatedGuard } from '../../../src/auth/common/guards/authenticated.guard';
import { RolesGuard } from '../../../src/auth/common/guards/roles.guard';
import { RolesPG } from '../../../src/auth/roles.decorator';
import { UserRole } from '../../../entities/user.entity';

@Controller('pgclient')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)
export class ClientControllerPG {
  constructor(
    private clientServicePG: ClientServicePG,
    private carServicePG: CarServicePG,
  ) {}

  @Get('/')
  @Render('pg/client/clients')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async getClients(@Req() req, @Query() query: ClientPageOptionsDTO) {
    const carPageOptions = new ClientPageOptionsDTO(query);
    const clients = await this.clientServicePG.findClientsPaginate(
      carPageOptions,
    );
    const searchString = `${req.url.replace(
      /\/pgclient\??(page=\d+\&?)?/im,
      '',
    )}`;
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { clients, isAdmin, searchString };
  }

  @Get('admin')
  @Render('pg/client/clients')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  async getClientsForAdmin(@Req() req, @Query() query: ClientPageOptionsDTO) {
    const carPageOptions = new ClientPageOptionsDTO(query);
    const clients = await this.clientServicePG.findClientsPaginate(
      carPageOptions,
    );
    const searchString = `${req.url.replace(
      /\/pgclient\??(page=\d+\&?)?/im,
      '',
    )}`;
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    const message = req.flash('message');
    return { message, clients, isAdmin, searchString };
  }

  @Get('create')
  @Render('pg/client/create-client')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  getForm(@Req() req) {
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { message: req.flash('message'), isAdmin };
  }

  @Get(':id')
  @Render('pg/client/client')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async getClient(@Param('id') id, @Req() req) {
    const client = await this.clientServicePG.findClient(id);
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
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN, UserRole.MANAGER)
  async createClient(
    @Res() res,
    @Req() req,
    @Body() clientData: CreateClientDTO,
  ) {
    try {
      const newClient = await this.clientServicePG.createClient(clientData);
      return res.redirect(`${newClient.id}`);
    } catch (error) {
      req.flash('message', error.message);
      return res.redirect('create');
    }
  }

  @Delete(':clientId')
  @UseGuards(RolesGuard)
  @RolesPG(UserRole.ADMIN)
  async deleteClient(@Req() req, @Res() res, @Param('clientId') clientId) {
    let deletedClient;
    try {
      const findedClient = await this.clientServicePG.findClient(clientId);
      deletedClient = await this.clientServicePG.deleteClientWithTransaction(
        findedClient,
      );
      req.flash('message', `Client ${deletedClient.name} is deleted`);
      return res.status(HttpStatus.OK).json({
        message: 'Client successfully deleted',
        client: deletedClient,
      });
    } catch (error) {
      req.message('message', error);
      return res.redirect('/pgclient/admin');
    }
  }
}
