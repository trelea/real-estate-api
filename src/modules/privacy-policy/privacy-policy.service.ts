import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrivacyPolicy } from 'src/database/entities';
import { Repository } from 'typeorm';
import { PatchPrivacyPolicyDto } from './dtos';

@Injectable()
export class PrivacyPolicyService {
  constructor(
    @InjectRepository(PrivacyPolicy)
    private readonly privacyPolicyRepository: Repository<PrivacyPolicy>,
  ) {}

  async index() {
    try {
      let record = await this.privacyPolicyRepository.findOneBy({});
      if (!record) {
        record = this.privacyPolicyRepository.create({
          content_ro: 'Politica de Confidențialitate',
          content_ru: 'Политика конфиденциальности',
          content_en: 'Privacy Policy',
        });
        await this.privacyPolicyRepository.save(record);
      }
      return record;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async patch(privacyPolicyContent: PatchPrivacyPolicyDto) {
    try {
      const record = await this.index();
      return this.privacyPolicyRepository.update(
        { id: record.id },
        privacyPolicyContent,
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
