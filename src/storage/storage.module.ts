import { Module } from '@nestjs/common';
import StorageController from './storage.controller';
import StorageService from './storage.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { LocalStrategy } from '../auth/local.strategy';

@Module({
  controllers: [StorageController],
  providers: [StorageService, JwtStrategy, LocalStrategy],
})
export default class StorageModule {}
