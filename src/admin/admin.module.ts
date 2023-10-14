import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { User } from '@prisma/client';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [DatabaseModule, DatabaseModule],
  exports: [AdminService],
})
export class AdminModule implements OnApplicationBootstrap {
  constructor(private databaseService: DatabaseService) {}
  async onApplicationBootstrap() {
    try {
      const admin: User = await this.databaseService.user.findFirstOrThrow({
        where: { username: 'admin' },
      });

      if (admin.password !== process.env['ADMIN_PASSWORD']) {
        console.log('Updating Admin Password');
        await this.databaseService.user.update({
          where: admin,
          data: { password: process.env['ADMIN_PASSWORD'] },
        });
      }
    } catch (e) {
      console.log('Adding User Admin');
      await this.databaseService.user.create({
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
