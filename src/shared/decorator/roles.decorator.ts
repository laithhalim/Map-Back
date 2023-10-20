// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/common/enum/Role-Enum';

export const ROLE_KEY = 'role';
export const RoleRequired = (role: RoleEnum) => SetMetadata(ROLE_KEY, role);
