import { SetMetadata } from '@nestjs/common';
import { AvailableRoles, ROLE_KEY } from '../common/constants/authorization';

export const Roles = (role: AvailableRoles) => SetMetadata(ROLE_KEY, role);
