import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AdminService {
  constructor(private databaseService: DatabaseService) {}

  async isUserAdmin(username: string): Promise<boolean> {
    const user = await this.databaseService.user.findFirstOrThrow({
      where: { username },
    });

    return user.isAdmin;
  }
}
