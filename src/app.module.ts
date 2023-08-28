import { Module } from '@nestjs/common';
import AuthModule from './auth/auth.module';
import StorageModule from './storage/storage.module';

@Module({
  imports: [
    AuthModule,
    StorageModule
  ],
})
export class AppModule {}
