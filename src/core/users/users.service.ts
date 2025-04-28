import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile, User } from 'src/database/entities';
import {
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { SignupDto } from '../auth/dtos';
import { CryptoService } from 'src/crypto';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profilesRespository: Repository<Profile>,
    private readonly entityManager: EntityManager,
    private readonly cryptoService: CryptoService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async findUserBy(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User | null> {
    return await this.usersRepository.findOne({
      where,
      relations: { profile: true },
    });
  }

  async findUsers(options?: FindManyOptions<User>) {
    return this.usersRepository.find(options);
  }

  async createUser(_user: SignupDto, _thumbnail?: Express.Multer.File) {
    return await this.entityManager.transaction(async (transaction) => {
      /**
       * ecnrypt password
       */
      _user.password = await this.cryptoService.encrypt(_user.password);
      _user.contact = _user.contact?.length ? _user.contact : undefined;

      const { email, password, role, ..._profile } = _user;
      const user = this.usersRepository.create({
        email,
        password,
        role,
      });

      /**
       * try to upload file on s3
       */
      let thumbnail: string | undefined = undefined;
      if (_thumbnail)
        thumbnail = (await this.awsS3Service.uploadFile(_thumbnail, user.id))
          .url;

      /**
       * transact data into db
       */
      const profile = this.profilesRespository.create({
        thumbnail,
        user: await transaction.save(user),
        ..._profile,
      });

      await transaction.save(profile);
    });
  }
}
