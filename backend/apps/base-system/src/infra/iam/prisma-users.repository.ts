import { Injectable } from '@nestjs/common';

import { User } from '../../lib/bounded-contexts/iam/domain/user.entity';
import { UsersRepository } from '../../lib/bounded-contexts/iam/domain/user.repository';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaUsersRepository extends UsersRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    const value = identifier.trim();

    if (!value) {
      return null;
    }

    const record = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: value }, { email: value.toLowerCase() }],
      },
    });

    if (!record) {
      return null;
    }

    return new User({
      id: record.id,
      username: record.username,
      email: record.email,
      passwordHash: record.passwordHash,
      createdAt: record.createdAt,
    });
  }
}
