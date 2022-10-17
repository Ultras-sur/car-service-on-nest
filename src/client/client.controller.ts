import { Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Redirect, UseGuards, UseFilters } from '@nestjs/common';
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

  /*@Get()
  // @Render('client/clients')
  async index(@Res() res) {
    const clients = await this.clientService.findAll();
    return res.status(HttpStatus.OK).json(clients);
  }*/

  
  @Get('all')
  @Render('client/clients')
  @UseGuards(RolesGuard)  
  @Roles(Role.ADMIN, Role.MANAGER)   
  async getClients(@Query('page') page: number) {
    const currentPage = page ?? 1;
    const clients = await this.clientService.findAll(currentPage);
    return { ...clients }
  }

 
  @Get('create')
  @Render('client/create-client')
  @UseGuards(RolesGuard)  
  @Roles(Role.ADMIN, Role.MANAGER)   
  getForm(): void {
    return;
  }

  
  @Get(':id')
  @Render('client/client')
  @UseGuards(RolesGuard)  
  @Roles(Role.ADMIN, Role.MANAGER)   
  async getClient(@Res() res: Response, @Param('id', new ValidateObjectId()) clientID) {
    const client = await this.clientService.findOne(clientID);
    const cars = await this.carService.findOwnerCars(clientID);
    if (!client) throw new NotFoundException('Client does not exist!');
    return { client, cars };
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
      post: editedClient
    })
  }

   
  @Delete('delete')
  @UseGuards(RolesGuard)  
  @Roles(Role.ADMIN, Role.MANAGER) 
  async deleteClient(@Res() res: Response,
    @Query('clientID', new ValidateObjectId()) clientID) {
    const deletedClient = await this.clientService.deleteClient(clientID);
    if (!deletedClient) throw new NotFoundException('Client does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Client has been deleted!',
      post: deletedClient
    })
  }
}
