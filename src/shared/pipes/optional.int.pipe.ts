import {
  ArgumentMetadata,
  BadRequestException,
  ParseIntPipe,
  PipeTransform,
} from '@nestjs/common';

export class ParseIntPipeOptional
  extends ParseIntPipe
  implements PipeTransform
{
  async transform(
    value: string | number,
    metadata: ArgumentMetadata,
  ): Promise<number> {
    if (!value) return value as number;
    if (isNaN(value as number)) throw new BadRequestException();
    return Number(value);
  }
}
