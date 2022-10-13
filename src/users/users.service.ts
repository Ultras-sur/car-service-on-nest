import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDTO } from '../../dto/create-user.dto';
import { LoginDTO } from 'dto/login.dto';
import bcrypt = require('bcrypt');



@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findByEmail(userData: LoginDTO): Promise<User> {
    console.log(userData);
    const { email, password } = userData;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    if (await bcrypt.compare(password, user.password.toString())) {
      console.log(user);
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async findUser(condition): Promise<User> {
    return await this.userModel.findOne(condition);
    /*if (!user) return null; // throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    return user;*/
  }

  async create(registrationData: CreateUserDTO): Promise<User> {
    const { email, password, roles } = registrationData;
    const user = await this.userModel.findOne({ email });
    if (user) throw new HttpException('User is already exists', HttpStatus.BAD_REQUEST);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const createdUser = new this.userModel({ email, password: hashedPassword, roles });
      await createdUser.save();
      return this.sanitizeUser(createdUser, 'password');
    } catch (error) {
      throw new HttpException('Error registration', HttpStatus.BAD_REQUEST);
    }
  }

  async findByPayload(payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  sanitizeUser(user, ...keys) {
    const sanitized = user.toObject();
    keys.forEach(key => delete sanitized[key]);
    return sanitized;
  }
}
