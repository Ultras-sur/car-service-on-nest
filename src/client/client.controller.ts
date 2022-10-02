import { Controller, Get, Render, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete, Redirect } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDTO } from '../../dto/create-client.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { CarService } from '../car/car.service';


@Controller('client')
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
  async getClients(@Query('page') page: number) {
    const currentPage = page ?? 1;
    const clients = await this.clientService.findAll(currentPage);
    return { ...clients }
  }

  @Get('create')
  @Render('client/create-client')
  getForm(): void {
    return;
  }

  @Get(':id')
  @Render('client/client')
  async getClient(@Res() res, @Param('id', new ValidateObjectId()) clientID) {
    const client = await this.clientService.findOne(clientID);
    const cars = await this.carService.findOwnerCars(clientID);
    if (!client) throw new NotFoundException('Client does not exist!');
    // return res.status(HttpStatus.OK).json(client);
    return { client, cars };
  }

  @Post('new')
  // @Redirect('all', 301)
  async createClient(@Res() res, @Body() createClientDTO: CreateClientDTO) {
    const newClient = await this.clientService.create(createClientDTO);
    if (!newClient) throw new NotFoundException('New client is not created!');
    return res.redirect(`/client/${newClient['_id']}`);
  }

  @Put('edit')
  async editClient(@Res() res,
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
  async deleteClient(@Res() res,
    @Query('clientID', new ValidateObjectId()) clientID) {
    const deletedClient = await this.clientService.deleteClient(clientID);
    if (!deletedClient) throw new NotFoundException('Client does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Client has been deleted!',
      post: deletedClient
    })
  }
}
