import { Injectable } from '@nestjs/common';
import { CreateShareDto } from './sharing.dto';
import { DatabaseService } from '../database/database.service';
import { Option, unwrap, from, isSome } from '../RO/Option';

@Injectable()
export class SharingService {
  constructor(private databaseService: DatabaseService) {}

  async createShare(request, body: CreateShareDto) {
    try {
      //check if file exists
      const file = await this.databaseService.files.findFirst({
        where: {
          userId: request['user'].sub as number,
          id: body.fileId,
        },
      });

      if (!file) {
        return { error: 'File not found' };
      }

      //check if target user exists
      const user = await this.databaseService.user.findFirst({
        where: {
          id: body.userId,
        },
      });

      if (!user) {
        return { error: 'User not found' };
      }

      //check if the file owner is the same as the user requesting the share
      if (file.userId === body.userId) {
        return { error: 'Cannot share file with yourself' };
      }

      //check if user has permission to share the file. (owner)
      if (file.userId !== request['user'].sub) {
        return { error: 'You do not have permission to share this file' };
      }

      //check if share already exists
      const share = await this.databaseService.reference.findFirst({
        where: {
          fileId: body.fileId,
          userId: body.userId,
        },
      });

      if (share) {
        return { error: 'Share already exists' };
      }

      const expirationDate: Option<Date> = from(body.expirationDate);
      if (isSome(expirationDate)) {
        if (unwrap(expirationDate) < new Date()) {
          return { error: 'Expiration date cannot be in the past' };
        }
      } else {
        //create a date in 30 days
        const date = new Date();
        date.setDate(date.getDate() + 30);
        body.expirationDate = date;
      }

      //create share
      const newShare = await this.databaseService.reference.create({
        data: {
          fileId: body.fileId,
          userId: body.userId,
          accessExpireDate: body.expirationDate,
        },
      });

      return { share: newShare };
    } catch (e) {
      console.error(e);
      return { error: 'Error creating share' };
    }
  }

  async revertShare(request, body) {
    try {
      //parse body.fileId for number and replace it
      body.fileId = parseInt(body.fileId);

      //check if file exists

      const file = await this.databaseService.files.findFirst({
        where: {
          userId: request['user'].sub as number,
          id: body.fileId as number,
        },
      });

      if (!file) {
        return { error: 'File not found' };
      }

      //check if target user exists
      const user = await this.databaseService.user.findFirst({
        where: {
          id: body.userId as number,
        },
      });

      if (!user) {
        return { error: 'User not found' };
      }

      //check if user has permission to share the file. (owner)
      if (file.userId !== request['user'].sub) {
        return { error: 'You do not have permission to share this file' };
      }

      //if references exist, delete them
      const references = await this.databaseService.reference.findMany({
        where: {
          fileId: body.fileId as number,
          userId: body.userId as number,
        },
      });

      if (references.length === 0) {
        return { error: 'Share not found' };
      }

      await this.databaseService.reference.deleteMany({
        where: {
          fileId: body.fileId,
          userId: {
            equals: body.userId,
          },
        },
      });

      return { message: 'Share reverted' };
    } catch (e) {
      console.error(e);
      return { error: 'Error reverting share' };
    }
  }
}
