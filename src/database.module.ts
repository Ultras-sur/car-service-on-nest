import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from '../entities/client.entity';
import { Car } from '../entities/car.entity';
import { Order } from '../entities/order.entity';
import { CarBrand } from '../entities/car-brand.entity';
import { CarModel } from '../entities/car-model.entity';
import { JobCategory } from '../entities/job-category.entity';
import { Job } from '../entities/job.entity';
import { WorkPost } from '../entities/workpost.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [
          Client,
          Car,
          Order,
          CarBrand,
          CarModel,
          JobCategory,
          Job,
          WorkPost,
          User,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
