import { Injectable } from '@nestjs/common';
import * as Multer from 'multer';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import User from '../entities/User';
import * as crypto from 'crypto';
import { from, isNone, None, Option } from '../RO/Option';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export default class StorageService {
  async authUser() {}
  async upload(
    req: Request,
    files: Array<Multer.File>,
    override: Option<string>,
  ) {}
}
