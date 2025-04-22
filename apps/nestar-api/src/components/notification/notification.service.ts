import { Injectable } from '@nestjs/common';
import { NotificationInput, NotificationInquiry } from '../../libs/dto/notification/notification.input';
import { Notification } from '../../libs/dto/notification/notification';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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

    return list;
  }

  async createNotification(input: NotificationInput): Promise<Notification> {
    console.log('🛠️ CREATE NOTIFICATION INPUT:', input);
    const notification = new this.notificationModel(input);
    return notification.save();
  }

  async countMyNotifications(memberId: string): Promise<number> {
    return this.notificationModel.countDocuments({ receiverId: memberId });
  }
}
