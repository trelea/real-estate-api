import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service, ServiceContent } from 'src/database/entities';
import { EntityManager, FindOptionsWhere, Like, Repository } from 'typeorm';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { CreateServiceDto, UpdateServiceDto } from './dtos';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRespository: Repository<Service>,
    @InjectRepository(ServiceContent)
    private readonly servicesContentRepository: Repository<ServiceContent>,
    private readonly awsS3Service: AwsS3Service,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * find all
   */
  async findAll(page?: number, limit?: number, search?: string) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;

    let where:
      | FindOptionsWhere<Service>
      | FindOptionsWhere<Service>[]
      | undefined = undefined;
    if (search) {
      where = [
        {
          content: [
            { title_en: Like(`%${search}%`) },
            { title_ro: Like(`%${search}%`) },
            { title_ru: Like(`%${search}%`) },
            { desc_en: Like(`%${search}%`) },
            { desc_ro: Like(`%${search}%`) },
            { desc_ru: Like(`%${search}%`) },
          ],
        },
      ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await this.servicesRespository.findAndCount({
      relations: { content: true },
      skip,
      where,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: { page, limit, total, last_page: Math.ceil(total / limit) },
    };
  }

  /**
   * find by id
   */
  async findById(id: string) {
    try {
      const service = await this.servicesRespository.findOne({
        where: { id },
        relations: { content: true },
      });
      if (!service) throw new NotFoundException();
      return service;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  /**
   * delete blog
   */
  async delete(id: string) {
    try {
      return await this.servicesRespository.remove(
        await this.servicesRespository.findBy({ id }),
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * create blog
   */
  async create(service: CreateServiceDto, thumbnail?: Express.Multer.File) {
    return this.entityManager.transaction(async (transaction) => {
      /**
       * thumbnail operation
       */
      let _thumbnail: string | undefined = undefined;
      if (thumbnail)
        _thumbnail = (await this.awsS3Service.uploadFile(thumbnail)).url;
      const { status, ...content } = service;
      const _service = this.servicesRespository.create({
        status,
        thumbnail: _thumbnail,
      });
      const serviceContent = this.servicesContentRepository.create({
        /**
         * content
         */
        ...content,
        /**
         * blog id
         */
        service: await transaction.save(_service),
      });
      await transaction.save(serviceContent);
    });
  }

  /**
   * update blog
   */
  async update(
    id: string,
    service: UpdateServiceDto,
    thumbnail?: Express.Multer.File,
  ) {
    /**
     * wait to find it
     */
    const {
      content: { id: content_id },
    } = await this.findById(id);

    /**
     * transaction
     */
    return await this.entityManager.transaction(async (transaction) => {
      const { status, ...content } = service;

      let _thumbnail: string | undefined = undefined;
      if (thumbnail)
        _thumbnail = (await this.awsS3Service.uploadFile(thumbnail)).url;

      if (status || _thumbnail)
        await transaction.update(
          Service,
          { id },
          { status, thumbnail: _thumbnail },
        );

      if (content)
        await transaction.update(
          ServiceContent,
          { id: content_id },
          { ...content },
        );
    });
  }

  /**
   * remove thumb
   */
  async removeThumb(id: string) {
    return await this.servicesRespository.update({ id }, { thumbnail: null });
  }
}
