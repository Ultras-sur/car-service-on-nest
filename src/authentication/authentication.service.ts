import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from '../../dto/create-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) { }

  public async register(registrationData: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({ ...registrationData, password: hashedPassword });
      createdUser.password = undefined;
      return createdUser;
    } catch(error) {
      throw new HttpException('Error registration', HttpStatus.BAD_REQUEST);
    }
  }
}

