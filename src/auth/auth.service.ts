import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from 'dto/login.dto';
import bcrypt = require('bcrypt');
import { User } from 'schemas/user.schema'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(userData: LoginDTO): Promise<User | null>  {
    const { email, password } = userData;
    const user = await this.usersService.findUser({ email });
    if(user && await bcrypt.compare(password, user.password.toString())) {
      return this.usersService.sanitizeUser(user, 'password');
    } 
    return null;
  }
}
