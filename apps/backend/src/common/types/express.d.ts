import type { AuthUser } from '@/modules/auth/domain/interfaces/authUser';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
