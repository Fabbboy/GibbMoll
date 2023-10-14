import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from 'src/users/users.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [DatabaseModule, DatabaseModule],
})
export class AdminModule implements OnApplicationBootstrap {
  constructor(private databaseService: DatabaseService) {}
  async onApplicationBootstrap() {
    if (
      this.databaseService.user.findFirst({ where: { username: 'admin' } }) ==
      null
    ) {
      this.databaseService.user.create({
        data: {
          isAdmin: true,
          creationDate: Date.now(),
          password: process.env['ADMIN_PASSWORD'],
          username: 'admin',
        },
      });
    }
  }
}
