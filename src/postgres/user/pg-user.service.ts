import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entities/user.entity';
import { ArrayContains, Equal, ILike, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import bcrypt = require('bcrypt');
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserPageOptionsDTO } from './dto/user-page-options.dto';
import { PageMetaDTO } from './dto/page-meta.dto';
import { PageDTO } from './dto/page.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('UserService');

export class UserServicePG {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUser(condition = {}): Promise<User> {
    debug('findUser');
    const findedUser = await this.userRepository.findOne(condition);
    return findedUser;
  }

  async findUsers(condition = {}): Promise<User[]> {
    debug('findUsers');
    const findedUsers = await this.userRepository.find(condition);
    return findedUsers;
  }

  async findUsersAndCount(condition = {}): Promise<[User[], number]> {
    debug('findUsers');
    const findedUsers = await this.userRepository.findAndCount(condition);
    return findedUsers;
  }

  async findUsersPaginate(
    userPageOptions: UserPageOptionsDTO,
  ): Promise<PageDTO<User>> {
    debug('FindUsersPaginate');
    const { login, name, roles, order, skip, take, roles_choosed } = userPageOptions;
    const usersAndCount = await this.userRepository.findAndCount({
      select: {
        id: true,
        login: true,
        name: true,
        roles: true,
      },
      where: {
        name: name ? ILike(`%${name}%`) : null,
        login: login ? ILike(`%${login}%`) : null,
        // eslint-disable-next-line prettier/prettier
        roles: roles ? (roles_choosed ? Equal(roles) : ArrayContains(roles)) : null,
      },
      order: { name: order },
      skip: skip,
      take: take,
    });

    const [users, usersCount] = usersAndCount;
    const pageMeta = new PageMetaDTO(usersCount, userPageOptions);
    return new PageDTO(users, pageMeta);
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    debug('createUser');
    const { login, name, roles, password } = userData;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.login = :login', { login })
      .getOne();
    if (user)
      throw new HttpException(
        'Error registration: user is already exists',
        HttpStatus.BAD_REQUEST,
      );
    const hashedPassword = await bcrypt.hash(password, 10);
    const rolesAsArray = Array.isArray(roles) ? roles : [roles];
    try {
      const createdUser = this.userRepository.create({
        login,
        name,
        roles: rolesAsArray,
        password: hashedPassword,
      });
      await this.userRepository.save(createdUser);
      return this.sanitizeUser(createdUser);
    } catch (error) {
      if (error) {
        debug(`error: ${error}`);
        throw new HttpException(
          `Error registration: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async deleteUser(userId): Promise<User> {
    const deletedUser = this.userRepository
      .createQueryBuilder('user')
      .delete()
      .from(User)
      .where('id = :id', { id: userId })
      .returning('*')
      .execute()
      .then((res) => res.raw[0]);
    return deletedUser;
  }

  sanitizeUser(user) {
    debug('sanitizeUser');
    const { password, ...sanitizedUser } = user;
    debug(sanitizedUser);
    return sanitizedUser;
  }
}
