import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'entities/user.entity';

export const RolesPG = (...roles: UserRole[]) => SetMetadata('roles', roles);
