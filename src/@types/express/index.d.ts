import { User as _User } from 'src/database/entities';
declare global {
  namespace Express {
    interface User extends Omit<_User, 'password'> {}
  }
}
