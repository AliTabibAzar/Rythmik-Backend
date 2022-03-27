import { User } from 'src/user/schemas/user.schema';

export interface AuthResponseInterface {
  access_token?: string;
  refresh_token?: string;
  user: User;
}
