import { IOrderDocument, IOrderNotifcation } from '@quan0401/ecommerce-shared';
import { OrderNotificationModel } from '~/models/notification.schema';
import { socketIOOrderObject } from '~/server';
import { getOrderByOrderId } from './order.service';

export const createNotification = async (data: IOrderNotifcation): Promise<IOrderNotifcation> => {
  const notification: IOrderNotifcation = await OrderNotificationModel.create(data);
  return notification;
};

export const getNotificationsById = async (userToId: string): Promise<IOrderNotifcation[]> => {
  // userToId is the email of the user
  const notification: IOrderNotifcation[] = await OrderNotificationModel.aggregate([{ $match: { userTo: userToId } }]);
  return notification;
};

export const markNotificationAsRead = async (notificationId: string): Promise<IOrderNotifcation> => {
  const notification: IOrderNotifcation = (await OrderNotificationModel.findOneAndUpdate(
    {
      _id: notificationId
    },
    {
      $set: {
        isRead: true
      }
    },
    { new: true }
  )) as IOrderNotifcation;
  const order: IOrderDocument = await getOrderByOrderId(notification.orderId);
  socketIOOrderObject.emit('order notification', order, notification);
  return notification;
};

export const sendNotification = async (data: IOrderDocument, userToId: string, message: string): Promise<IOrderNotifcation> => {
  const notification: IOrderNotifcation = {
    userTo: userToId,
    senderUsername: data.sellerUsername,
    senderEmail: data.sellerEmail,
    senderPicture: data.sellerImage,
    receiverUsername: data.buyerUsername,
    receiverEmail: data.buyerEmail,
    receiverPicture: data.buyerImage,
    message,
    orderId: data.orderId
  } as IOrderNotifcation;
  const orderNotification: IOrderNotifcation = await createNotification(notification);
  socketIOOrderObject.emit('order notification', data, orderNotification);
  return notification;
};
