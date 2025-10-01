import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LoginResultDto } from '../dto/login-result.dto';
import { PasswordHasher } from '../services/password-hasher.service';
import { TokenService } from '../services/token.service';
import { UsersRepository } from '../../domain/user.repository';
import { LoginCommand } from './login.command';

@CommandHandler(LoginCommand)
export class LoginHandler
  implements ICommandHandler<LoginCommand, LoginResultDto>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResultDto> {
    const identifier = command.identifier.trim();

    if (!identifier) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.usersRepository.findByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      command.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.tokenService.createAccessToken({
      sub: user.id,
      username: user.username,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
