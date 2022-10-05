import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDTO } from '../../dto/create-user.dto';
import { LoginDTO } from 'dto/login.dto';
import bcrypt from 'bcrypt';



@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findByEmail(userData: LoginDTO): Promise<User> {
    const { email, password } = userData;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    if (await bcrypt.compare(password, user.password.toString())) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async create(registrationData: CreateUserDTO): Promise<User> {
    const { email, password } = registrationData;
    const user = await this.userModel.findOne({ email });
    if (user) throw new HttpException('User is already exists', HttpStatus.BAD_REQUEST);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const createdUser = new this.userModel({ email, password: hashedPassword });
      await createdUser.save();
      return this.sanitizeUser(createdUser);
    } catch (error) {
      throw new HttpException('Error registration', HttpStatus.BAD_REQUEST);
    }
  }

  async findByPayload(payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  sanitizeUser(user) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
