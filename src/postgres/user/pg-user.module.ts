import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../entities/user.entity';
import { UserControllerPG } from './pg-user.controller';
import { UserServicePG } from './pg-user.service';
import { RedisModule } from 'src/infrastructure/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
  providers: [UserServicePG],
  controllers: [UserControllerPG],
  exports: [UserServicePG],
})
export class UserModulePG {}
