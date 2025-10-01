import { Module } from '@nestjs/common';

import { IamModule } from '../lib/bounded-contexts/iam/iam.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [IamModule],
  controllers: [AuthController],
})
export class ApiModule {}
