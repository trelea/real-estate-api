import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TermsAnsConditions } from 'src/database/entities';
import { Repository } from 'typeorm';
import { PatchTermsAndConditionsDto } from './dtos';

@Injectable()
export class TermsAndConditionsService {
  constructor(
    @InjectRepository(TermsAnsConditions)
    private readonly termsAndConditionsRepository: Repository<TermsAnsConditions>,
  ) {}

  async index() {
    try {
      let record = await this.termsAndConditionsRepository.findOneBy({});
      if (!record) {
        await this.termsAndConditionsRepository.save(
          this.termsAndConditionsRepository.create(),
        );
      }
      return record;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async patch(termsAndConditionsContent: PatchTermsAndConditionsDto) {
    try {
      return this.termsAndConditionsRepository.update(
        {
          id: (await this.index())?.id,
        },
        termsAndConditionsContent,
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
