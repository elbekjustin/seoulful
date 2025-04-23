import { Injectable } from '@nestjs/common';
import { NotificationInput, NotificationInquiry } from '../../libs/dto/notification/notification.input';
import { Notification } from '../../libs/dto/notification/notification';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotificationStatus } from '../../libs/enums/notification.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
  ) {}

  async getMyNotifications(input: NotificationInquiry, memberId: string): Promise<Notification[]> {
    const rawList = await this.notificationModel
      .find({ receiverId: new Types.ObjectId(memberId) })
      .populate({
        path: 'authorId',
        select: 'memberImage memberNick',
        model: 'Member',
      })
      .sort({ createdAt: -1 })
      .limit(input.limit)
      .skip((input.page - 1) * input.limit)
      .lean()
      .exec();

    const list = rawList.map((n: any) => ({
      ...n,
      authorData: n.authorId, // frontend uchun kerakli nom
    }));
console.log('🔍 getMyNotifications receiverId:', memberId);

    return list;

  }

  async createNotification(input: NotificationInput): Promise<Notification> {
    console.log('🛠️ CREATE NOTIFICATION INPUT:', input);
    const notification = new this.notificationModel({
        ...input,
        receiverId: new Types.ObjectId(input.receiverId),
        authorId: new Types.ObjectId(input.authorId),
        });
    return notification.save();
  }

  async countMyNotifications(memberId: string): Promise<number> {
    return this.notificationModel.countDocuments({ receiverId: memberId });
  }

  async markAsRead(id: string): Promise<boolean> {
  const result = await this.notificationModel.updateOne(
    { _id: id },
    { $set: { notificationStatus: NotificationStatus.READ } }
  ).exec();

  return result.modifiedCount > 0;
}

}
