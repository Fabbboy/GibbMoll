import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [DatabaseModule],
})
export class AdminModule {}
