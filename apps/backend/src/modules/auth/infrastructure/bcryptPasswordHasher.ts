import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '../domain/interfaces/passwordHasher';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
