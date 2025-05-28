import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AboutUs } from 'src/database/entities';
import { Repository } from 'typeorm';
import { PatchAboutUsDto } from './dtos';

@Injectable()
export class AboutUsService {
  constructor(
    @InjectRepository(AboutUs)
    private readonly aboutUsRepository: Repository<AboutUs>,
  ) {}

  async index() {
    try {
      let record = await this.aboutUsRepository.findOneBy({});
      if (!record) {
        record = this.aboutUsRepository.create({
          content_ro: 'Despre Noi',
          content_ru: 'О нас',
          content_en: 'About Us',
        });
        await this.aboutUsRepository.save(record);
      }
      return record;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async patch(aboutUsContent: PatchAboutUsDto) {
    try {
      const record = await this.index();
      return this.aboutUsRepository.update({ id: record.id }, aboutUsContent);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
