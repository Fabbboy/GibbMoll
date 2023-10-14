import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { SharingService } from './sharing.service';
import { CreateShareDto } from './sharing.dto';

@Controller('sharing')
export class SharingController {
  constructor(private readonly sharingService: SharingService) {}

  @Post('create')
  createShare(@Req() req, @Body() body: CreateShareDto) {
    return this.sharingService.createShare(req, body);
  }
}
