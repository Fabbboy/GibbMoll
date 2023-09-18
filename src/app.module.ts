import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import StorageModule from './storage/storage.module';

@Module({
  imports: [AuthModule, StorageModule, DatabaseModule],
})
export class AppModule {}
