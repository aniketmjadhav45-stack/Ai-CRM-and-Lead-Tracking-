import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrmModule } from './crm/crm.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CrmModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
