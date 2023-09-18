import { Module } from '@nestjs/common';
import StorageController from './storage.controller';
import StorageService from './storage.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [StorageController],
  providers: [StorageService],
  imports: [DatabaseModule],
})
export default class StorageModule {}
