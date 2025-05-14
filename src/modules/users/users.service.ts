import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { UsersService as _UsersService } from '../../core/users';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersService: _UsersService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * create agent or admin
   */
  async create(user: CreateUserDto, thumbnail?: Express.Multer.File) {
    const _user = await this.usersService.findUserBy({ email: user.email });
    if (_user) throw new ConflictException('Resources Already Exists');
    try {
      return await this.usersService.createUser(user, thumbnail);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * find all
   */
  async findAll(page?: number, limit?: number, search?: string) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;

    let where = {};
    if (search) {
      where = [
        { email: Like(`%${search}%`) },
        { profile: { name: Like(`%${search}%`) } },
        { profile: { surname: Like(`%${search}%`) } },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await this.usersRepository.findAndCount({
      relations: { profile: true },
      skip,
      where,
      take: limit,
      order: { created_at: 'DESC' },
    });

    const data = users.map(({ password, ...rest }) => ({ ...rest }));

    return {
      data,
      meta: { page, limit, total, last_page: Math.ceil(total / limit) },
    };
  }

  /**
   * find by id
   */
  async findById(id: string) {
    const _user = await this.usersService.findUserBy({ id });
    if (!_user) throw new NotFoundException();
    const { password, ...user } = _user;
    return user;
  }

  /**
   * delete
   */
  async delete(id: string) {
    try {
      return await this.usersRepository.remove(
        await this.usersRepository.findBy({ id }),
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * update
   */
  async update(
    id: string,
    user: UpdateUserDto,
    thumbnail?: Express.Multer.File,
  ) {
    const _user = await this.usersService.findUserBy({ id });
    if (!_user) throw new NotFoundException();

    console.log('INTO UPDATE', thumbnail);

    try {
      return await this.usersService.updateUser(
        {
          user_id: id,
          profile_id: _user?.profile.id as string,
        },
        user,
        thumbnail,
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
