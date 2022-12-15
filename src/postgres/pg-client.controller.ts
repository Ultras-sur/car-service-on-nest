import { Controller, Get, Render, Post, Res, Req, UseGuards, UseFilters, Query, HttpStatus } from '@nestjs/common';
import { ClientServisePG } from './pg-client.service';


@Controller('pg')
export class ClientControllerPG {
  constructor(private pgclientService: ClientServisePG) { }

  @Get('create')
  async pgCreate(@Res() res) {
    const newClient = await this.pgclientService.createClient()
    return res.status(HttpStatus.OK).json({
      client: newClient,
    });
  }
}