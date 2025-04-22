import { Module } from '@nestjs/common';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import { MongooseModule } from '@nestjs/mongoose';
import FollowSchema from '../../schemas/Follow.model';
import { fstat } from 'fs';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
            {
                name : 'Follow',
                schema: FollowSchema,
            },
        ]),
        AuthModule,
        MemberModule,
        NotificationModule
  ],
  providers: [FollowResolver, FollowService],
  exports: [FollowResolver, FollowService]
})
export class FollowModule {}
