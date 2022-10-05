import { Controller, Get, Render, Post, Body, Redirect, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from './authentication.service';
import { CreateUserDTO } from 'dto/create-user.dto';
import { LoginDTO } from 'dto/login.dto';


@Controller('authentication')
export class AuthenticationController {
  constructor(private userService: UsersService, private authenticationService: AuthenticationService) { }

  @Post('register')
  async register(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.create(createUserDTO);
    const payload = {
      email: user.email,
    }
    const token = await this.authenticationService.signPayload(payload);
    return { user, token };
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const user = await this.userService.findByEmail(loginDTO);
    const payload = {
      email: user.email,
    }
    const token = await this.authenticationService.signPayload(payload);
    return { user, token };
  }

}
