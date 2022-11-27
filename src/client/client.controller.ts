import { Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Redirect, UseGuards, UseFilters, Req } from '@nestjs/common';
import { Response } from 'express';
import { ClientService } from './client.service';
import { CreateClientDTO } from '../../dto/create-client.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { CarService } from '../car/car.service';
import { AuthenticatedGuard } from '../auth/common/guards/authenticated.guard';
import { AuthExceptionFilter } from 'src/auth/common/filters/auth-exceptions.filter';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { Role } from 'schemas/user.schema';
import { Roles } from 'src/auth/roles.decorator';


@Controller('client')
@UseFilters(AuthExceptionFilter)
@UseGuards(AuthenticatedGuard)

export class ClientController {
  constructor(private clientService: ClientService, private carService: CarService) { }

  @Get('admin/clients')
  @Render('admin/clients')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)  
  async getClientsForAdmin(@Query('name') name, @Query('licensNumber') licensNumber, @Query('page') page) {
    const findCondition = {};
    name ? findCondition['name'] = new RegExp(name, 'gmi') : null;
    licensNumber ? findCondition['licensNumber'] = licensNumber : null;
    const currentPage = page ?? 1;
    const step = 12;
    const sortCondition = { createdAt: 'desc' }; 
    const clients = await this.clientService.findAll(currentPage, step, sortCondition, findCondition);
    
    return { ...clients, isAdmin: true };
  }


  @Get('all')
  @Render('client/clients')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getClients(@Query('page') page: number, @Req() req) {
    const currentPage = page ?? 1;
    const step = 12;
    const clients = await this.clientService.findAll(currentPage, step);
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { ...clients, isAdmin }
  }


  @Get('create')
  @Render('client/create-client')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  getForm(@Req() req): { isAdmin: boolean } {
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { isAdmin };
  }


  @Get(':id')
  @Render('client/client')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async getClient(@Res() res: Response, @Req() req, @Param('id', new ValidateObjectId()) clientID) {
    const client = await this.clientService.findOne(clientID);
    const cars = await this.carService.findOwnerCars(clientID);
    if (!client) throw new NotFoundException('Client does not exist!');
    const isAdmin = req.user.roles.includes(Role.ADMIN);
    return { client, cars, isAdmin };
  }


  @Post('new')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async createClient(@Res() res: Response, @Body() createClientDTO: CreateClientDTO) {
    const newClient = await this.clientService.create(createClientDTO);
    if (!newClient) throw new NotFoundException('New client is not created!');
    return res.redirect(`/client/${newClient['_id']}`);
  }


  @Put('edit')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async editClient(@Res() res: Response,
    @Query('clientID', new ValidateObjectId()) clientID,
    @Body() createClientDTO: CreateClientDTO) {

    const editedClient = await this.clientService.editClient(clientID, createClientDTO);
    if (!editedClient) throw new NotFoundException('Client does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Client has been successfully updated',
      client: editedClient
    })
  }

  @Delete(':clientID')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deleteClient(@Res() res: Response,
    @Param('clientID', new ValidateObjectId()) clientID) {
    const clientCars = await this.carService.findOwnerCars(clientID);
    console.log(`Deleting client`);
    const deletedClient = await this.clientService.deleteClient(clientID, clientCars);
    return res.status(HttpStatus.OK).json({
      message: 'Client has been successfully deleted',
      client: deletedClient
    })
  }
}
