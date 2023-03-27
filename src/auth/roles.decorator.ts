import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'entities/user.entity';
import { Role } from 'schemas/user.schema';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
export const RolesPG = (...roles: UserRole[]) => SetMetadata('roles', roles);
