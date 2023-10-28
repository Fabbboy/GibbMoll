import { Controller, Get, Req } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('is')
  async isAdmin(@Req() req) {
    const username = req.user.username;
    return { isAdmin: await this.adminService.isUserAdmin(username) };
  }
}
