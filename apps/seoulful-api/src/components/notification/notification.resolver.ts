import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { NotificationInquiry } from '../../libs/dto/notification/notification.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { NotificationService } from './notification.service';
import { Notification, NotificationList } from '../../libs/dto/notification/notification';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService ) {}
  

  @UseGuards(AuthGuard)
  @Roles(MemberType.AGENT)
@Query(() => NotificationList)
public async getMyNotifications(
  @Args('input') input: NotificationInquiry,
  @AuthMember('_id') memberId: string,
): Promise<NotificationList> {
  console.log('🧪 MEMBER ID IN RESOLVER:', memberId); // 👈👈👈

  const list = await this.notificationService.getMyNotifications(input, memberId);
  const total = await this.notificationService.countMyNotifications(memberId);

  return {
    list,
    metaCounter: [{ total }],
  };
}


@Mutation(() => Boolean)
async markNotificationAsRead(@Args('id', { type: () => String }) id: string): Promise<boolean> {
  return this.notificationService.markAsRead(id);
}



}