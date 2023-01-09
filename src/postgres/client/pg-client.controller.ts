import { Controller, Get, Render, Post, Res, Req, UseGuards, UseFilters, Query, HttpStatus } from '@nestjs/common';
import { ClientServisePG } from './pg-client.service';


@Controller('pgclient')
export class ClientControllerPG {
  constructor(private pgclientService: ClientServisePG) { }

  @Get('createclient')
  async pgCreate(@Res() res) {
    const newClient = await this.pgclientService.createClient()
    return res.status(HttpStatus.OK).json({
      client: newClient,
    });
  }

  @Get('getclients')
  async getClients(@Res() res) {
    const clients = await this.pgclientService.findAll();
    return res.status(HttpStatus.OK).json({ clients });
  }
}