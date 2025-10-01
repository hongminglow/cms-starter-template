import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface TokenPayload {
  sub: string;
  username: string;
  email: string | null;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
