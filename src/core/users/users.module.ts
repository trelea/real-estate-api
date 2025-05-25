import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database';
import { Profile, User } from 'src/database/entities';
import { CryptoService } from 'src/services/crypto';
import { AwsS3Module } from 'src/modules/aws-s3/aws-s3.module';

@Module({
  imports: [DatabaseModule.forFeature([User, Profile]), AwsS3Module],
  providers: [UsersService, CryptoService],
  exports: [UsersService],
})
export class UsersModule {}
