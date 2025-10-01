import { User } from './user.entity';

export abstract class UsersRepository {
  abstract findByIdentifier(identifier: string): Promise<User | null>;
}
