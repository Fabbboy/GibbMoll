import { Controller, Get, Post, Body } from '@nestjs/common';
import { SharingService } from './sharing.service';
import { CreateShareDto } from './sharing.dto';

@Controller('sharing')
export class SharingController {
  constructor(private readonly sharingService: SharingService) {}

  @Post('create')
  createShare(@Body() body: CreateShareDto) {
   // return this.sharingService.createShare(body);
  }
}
