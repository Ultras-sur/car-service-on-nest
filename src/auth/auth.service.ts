import { Injectable } from '@nestjs/common';
import { LoginDTO } from 'dto/login.dto';
import bcrypt = require('bcrypt');
import { UserServicePG } from 'src/postgres/user/pg-user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userServicePG: UserServicePG) {}

  async validateUser(userData: LoginDTO) {
    const { email, password } = userData;
    //const user = await this.usersService.findUser({ email });
    const user = await this.userServicePG.findUser({ where: { login: email } });
    if (user && (await bcrypt.compare(password, user.password.toString()))) {
      return this.userServicePG.sanitizeUser(user);
    }
    return null;
  }
}
