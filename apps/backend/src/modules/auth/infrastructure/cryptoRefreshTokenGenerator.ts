import { randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { RefreshTokenGenerator } from '../domain/interfaces/refreshTokenGenerator';

@Injectable()
export class CryptoRefreshTokenGenerator implements RefreshTokenGenerator {
  generate(): string {
    return randomBytes(32).toString('base64url');
  }
}
