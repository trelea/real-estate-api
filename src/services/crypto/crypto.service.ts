import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { scryptSync } from 'node:crypto';

@Injectable()
export class CryptoService {
  private readonly salt: string;
  private readonly klen: number;

  constructor(private readonly configService: ConfigService) {
    this.salt = this.configService.getOrThrow<string>('CRYPTO_SALT');
    this.klen = parseInt(this.configService.getOrThrow<string>('CRYPTO_KLEN'));
  }

  async encrypt(plain: string): Promise<string> {
    return scryptSync(plain, this.salt, this.klen).toString('hex');
  }

  async verify(hashed: string, plain: string): Promise<boolean> {
    if (hashed === (await this.encrypt(plain))) return true;
    return false;
  }
}
