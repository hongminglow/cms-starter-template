import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { LoginCommand } from '../../lib/bounded-contexts/iam/application/commands/login.command';
import { LoginResultDto } from '../../lib/bounded-contexts/iam/application/dto/login-result.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginResultDto> {
    return this.commandBus.execute(
      new LoginCommand(dto.identifier, dto.password),
    );
  }
}
