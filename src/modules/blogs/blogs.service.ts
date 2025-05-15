import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto } from './dtos';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { EntityManager, FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog, BlogContent } from 'src/database/entities';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogsRespository: Repository<Blog>,
    @InjectRepository(BlogContent)
    private readonly blogsContentRepository: Repository<BlogContent>,
    private readonly awsS3Service: AwsS3Service,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * find all
   */
  async findAll(page?: number, limit?: number, search?: string) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;

    let where: FindOptionsWhere<Blog> | FindOptionsWhere<Blog>[] | undefined =
      undefined;
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
    const [data, total] = await this.blogsRespository.findAndCount({
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
      const blog = await this.blogsRespository.findOne({
        where: { id },
        relations: { content: true },
      });
      if (!blog) throw new NotFoundException();
      return blog;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  /**
   * delete blog
   */
  async delete(id: string) {
    try {
      return await this.blogsRespository.remove(
        await this.blogsRespository.findBy({ id }),
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * create blog
   */
  async create(blog: CreateBlogDto, thumbnail?: Express.Multer.File) {
    return this.entityManager.transaction(async (transaction) => {
      /**
       * thumbnail operation
       */
      let _thumbnail: string | undefined = undefined;
      if (thumbnail)
        _thumbnail = (await this.awsS3Service.uploadFile(thumbnail)).url;
      const { status, ...content } = blog;
      const _blog = this.blogsRespository.create({
        status,
        thumbnail: _thumbnail,
      });
      const blogContent = this.blogsContentRepository.create({
        /**
         * content
         */
        ...content,
        /**
         * blog id
         */
        blog: await transaction.save(_blog),
      });
      await transaction.save(blogContent);
    });
  }

  /**
   * update blog
   */
  async update(
    id: string,
    blog: UpdateBlogDto,
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
      const { status, ...content } = blog;

      let _thumbnail: string | undefined = undefined;
      if (thumbnail)
        _thumbnail = (await this.awsS3Service.uploadFile(thumbnail)).url;

      if (status || _thumbnail)
        await transaction.update(
          Blog,
          { id },
          { status, thumbnail: _thumbnail },
        );

      if (content)
        await transaction.update(
          BlogContent,
          { id: content_id },
          { ...content },
        );
    });
  }
}
