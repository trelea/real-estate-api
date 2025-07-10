import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/database/entities';

export const SetRoles = Reflector.createDecorator<UserRole[]>();
