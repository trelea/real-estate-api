import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersModule as _UsersModule } from '../../core/users';
import { DatabaseModule } from 'src/database';
import { User } from 'src/database/entities';

@Module({
  imports: [_UsersModule, DatabaseModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
