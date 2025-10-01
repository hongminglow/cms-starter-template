import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../../../infra/database/prisma.module';
import { PrismaUsersRepository } from '../../../infra/iam/prisma-users.repository';
import { LoginHandler } from './application/commands/login.handler';
import { PasswordHasher } from './application/services/password-hasher.service';
import { TokenService } from './application/services/token.service';
import { UsersRepository } from './domain/user.repository';

const CommandHandlers = [LoginHandler];

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'change-me'),
        signOptions: {
          expiresIn: configService.get<string | number>('JWT_EXPIRES_IN', '1h'),
        },
      }),
    }),
  ],
  providers: [
    PasswordHasher,
    TokenService,
    ...CommandHandlers,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [CqrsModule],
})
export class IamModule {}
