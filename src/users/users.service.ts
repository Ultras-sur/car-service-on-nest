import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDTO } from '../../dto/create-user.dto';
import { LoginDTO } from 'dto/login.dto';
import { UpdateUserDTO } from 'dto/update-user.dto';
import bcrypt = require('bcrypt');



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

  async findUser(condition): Promise<User> {
    return await this.userModel.findOne(condition);
    /*if (!user) return null; // throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    return user;*/
  }

  async updateUser(id, updatedUserDTO: UpdateUserDTO): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updatedUserDTO, { new: true });
    return updatedUser;
  }

  async findUsers(page, step, conditionData) {
    const condition = {}
    if (conditionData.hasOwnProperty('email')) {
      condition['email'] = new RegExp(conditionData['email'], 'gmi');
    }
    if (conditionData.hasOwnProperty('name')) {
      condition['name'] = new RegExp(conditionData['name'], 'gmi');
    }
    if (conditionData.hasOwnProperty('roles')) {
      condition['roles'] =
        { "$all": conditionData['roles'].map(role => role.toUpperCase()) };
    }
    const users = await this.userModel.find(condition, null, {
      limit: step,
      skip: step * (page - 1),
    });
    const totalDocuments = await this.userModel.find(condition).countDocuments();
    const totalPages = Math.ceil(totalDocuments / step);
    return { users, step, page, totalPages };
  }

  async create(registrationData: CreateUserDTO): Promise<User> {
    const { email, password, roles, name } = registrationData;
    const user = await this.userModel.findOne({ email });
    if (user) throw new HttpException('User is already exists', HttpStatus.BAD_REQUEST);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const createdUser = new this.userModel({ email, password: hashedPassword, roles, name });
      await createdUser.save();
      return this.sanitizeUser(createdUser, 'password');
    } catch (error) {
      throw new HttpException('Error registration', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(id): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    return deletedUser;
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
