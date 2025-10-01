import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infra/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
