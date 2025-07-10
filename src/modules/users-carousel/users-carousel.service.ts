import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/core/users';
import { UserCarousel } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateUserCarouselDto, UpdateUserCarouselDto } from './dtos';

@Injectable()
export class UsersCarouselService {
  constructor(
    @InjectRepository(UserCarousel)
    private readonly userCarouselRepository: Repository<UserCarousel>,
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    return await this.userCarouselRepository.find({
      relations: { user: { profile: true } },
      order: { priority: 'DESC' },
    });
    // this.userCarouselRepository.clear();
  }

  async create(entry: CreateUserCarouselDto) {
    const user = await this.usersService.findUserBy({ id: entry.user });
    if (!user) throw new NotFoundException();

    const exists = await this.userCarouselRepository.findOne({
      where: { user: { id: entry.user } },
    });
    if (exists) throw new ConflictException('User is already in the carousel');

    const _entry = this.userCarouselRepository.create({
      user,
      priority: entry.priority,
    });

    return this.userCarouselRepository.save(_entry);
  }

  async remove(id: string) {
    try {
      return await this.userCarouselRepository.remove(
        (await this.userCarouselRepository.findOneBy({ id })) as UserCarousel,
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(id: string, entry: UpdateUserCarouselDto) {
    const _entry = await this.userCarouselRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!_entry) throw new NotFoundException();
    _entry.priority = entry.priority as number;
    return this.userCarouselRepository.save(_entry);
  }
}
