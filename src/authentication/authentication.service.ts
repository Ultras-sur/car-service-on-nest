import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import jwt from 'jsonwebtoken';
import { CreateUserDTO } from '../../dto/create-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) { }

  async signPayload(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
  }

  async validateUser(payload) {
    return await this.usersService.findByPayload(payload);
  }
}

