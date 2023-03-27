import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { UserModulePG } from 'src/postgres/user/pg-user.module';

@Module({
  imports: [UsersModule, PassportModule, UserModulePG],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
