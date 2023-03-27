import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { ArrayContains, ILike, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import bcrypt = require('bcrypt');
import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { UserPageOptionsDTO } from './dto/user-page-options.dto';
import { PageMetaDTO } from './dto/page-meta.dto';
import { PageDTO } from './dto/page.dto';

export class UserServicePG {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUser(condition = {}): Promise<User> {
    const findedUser = await this.userRepository.findOne(condition);
    return findedUser;
  }

  async findUsers(condition = {}): Promise<User[]> {
    const findedUsers = await this.userRepository.find(condition);
    return findedUsers;
  }

  async findUsersPaginate(
    userPageOptions: UserPageOptionsDTO,
  ): Promise<PageDTO<User>> {
    const { login, name, roles, order, skip, take } = userPageOptions;
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
        roles: roles ? ArrayContains(roles) : null,
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
        throw new HttpException(
          `Error registration: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<User> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    console.log('refreshToken: ' + refreshToken);
    const updatedUser = await this.userRepository
      .createQueryBuilder('user')
      .update({ currentHashedRefreshToken })
      .where('id = :id', { id: userId })
      .returning('*')
      .execute()
      .then((res) => res.raw[0]);
    return updatedUser;
  }

  async removeRefreshToken(userId: string): Promise<User> {
    console.log('RemoveRefreshToken');
    const updatedUser = await this.userRepository
      .createQueryBuilder('user')
      .update({ currentHashedRefreshToken: null })
      .where('id = :id', { id: userId })
      .returning('*')
      .execute()
      .then((res) => res.raw[0]);
    return updatedUser;
  }

  async getUserIfRefreshTokenMatches(refreshToken: any, userId: string) {
    console.log('UserServicePG: getUserIfRefreshTokenMatches');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user.currentHashedRefreshToken) throw new ForbiddenException();
    const isRefreshTokenMatched = this.isRefreshTokenMatched(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatched) {
      return user;
    } else {
      throw new ForbiddenException();
    }
  }

  async isRefreshTokenMatched(refreshToken, currentHashedRefreshToken) {
    return bcrypt.compare(refreshToken, currentHashedRefreshToken);
  }

  sanitizeUser(user) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
