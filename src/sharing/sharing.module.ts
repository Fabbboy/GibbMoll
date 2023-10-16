import { Module } from '@nestjs/common';
import { SharingService } from './sharing.service';
import { SharingController } from './sharing.controller';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SharingController],
  providers: [SharingService],
  exports: [],
})
export class SharingModule {}
