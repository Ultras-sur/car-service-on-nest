import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDTO } from '../../dto/create-user.dto';



@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    return user;
  }

  async create(createUserDto: CreateUserDTO): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }
}
