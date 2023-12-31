import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';
import StorageModule from './storage/storage.module';
import {SharingModule} from './sharing/sharing.module';

@Module({
  imports: [AuthModule, StorageModule, DatabaseModule, AdminModule, SharingModule],
})
export class AppModule {}
