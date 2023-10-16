import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Delete,
  Query,
} from '@nestjs/common';
import { SharingService } from './sharing.service';
import { CreateShareDto, RevertShareDto } from './sharing.dto';

@Controller('sharing')
export class SharingController {
  constructor(private readonly sharingService: SharingService) {}

  @Post('create')
  createShare(@Req() req, @Body() body: CreateShareDto) {
    return this.sharingService.createShare(req, body);
  }

  @Delete('revert')
  revertShare(@Req() req, @Query() body: RevertShareDto) {
    return this.sharingService.revertShare(req, body);
  }
}
