import { chatChannel, socketIOChatObject } from '~/server';
import { IConversationDocument, IMessageDetails, IMessageDocument, lowerCase } from '@quan0401/ecommerce-shared';
import { ConversationModel } from '~/models/conversation.schema';
import { MessageModel } from '~/models/message.schema';
import { publishDirectMessage } from '~/queues/message.producer';

export const createConversation = async (conversation: IConversationDocument): Promise<IConversationDocument> => {
  const checkConversation: IConversationDocument | null = await conversationBetweenTwoUsersExisted(
    conversation.senderEmail,
    conversation.receiverEmail
  );
  if (!checkConversation) {
    return await ConversationModel.create(conversation);
  } else {
    let isModified = false;

    // Update senderUsername if it is different
    if (checkConversation.senderUsername !== conversation.senderUsername) {
      checkConversation.senderUsername = conversation.senderUsername;
      isModified = true;
    }

    // Update receiverUsername if it is different
    if (checkConversation.receiverUsername !== conversation.receiverUsername) {
      checkConversation.receiverUsername = conversation.receiverUsername;
      isModified = true;
    }

    // Save the modified conversation only if changes were made
    if (isModified) {
      await checkConversation.save();
    }
    return checkConversation;
  }
};
export const conversationBetweenTwoUsersExisted = async (
  senderEmail: string,
  receiverEmail: string
): Promise<IConversationDocument | null> => {
  const result: IConversationDocument | null = await ConversationModel.findOne({
    $or: [
      { senderEmail, receiverEmail },
      { senderEmail: receiverEmail, receiverEmail: senderEmail }
    ]
  });

  return result;
};

export const addMessage = async (data: IMessageDocument): Promise<IMessageDocument> => {
  const message: IMessageDocument = await MessageModel.create(data);
  if (data.hasOffer) {
    const emailMessageDetails: IMessageDetails = {
      sender: data.senderUsername,
      amount: `${data.offer?.price}`,
      buyerUsername: lowerCase(`${data.receiverUsername}`),
      sellerUsername: lowerCase(`${data.senderUsername}`),
      title: data.offer?.gigTitle,
      description: data.offer?.description,
      deliveryDays: `${data.offer?.deliveryInDays}`,
      template: 'offer'
    };
    // send email
    await publishDirectMessage(
      chatChannel,
      'ecommerce-order-notification',
      'order-email',
      JSON.stringify(emailMessageDetails),
      'Order email sent to notification service.'
    );
  }
  socketIOChatObject.emit('message received', message);
  return message;
};

export const getConversation = async (senderEmail: string, receiverEmail: string): Promise<IConversationDocument[]> => {
  const query = {
    $or: [
      {
        senderEmail,
        receiverEmail
      },
      {
        senderEmail: receiverEmail,
        receiverEmail: senderEmail
      }
    ]
  };
  const conversations: IConversationDocument[] = await ConversationModel.aggregate([{ $match: query }]);
  return conversations;
};

export const getUserConversationList = async (email: string): Promise<IMessageDocument[]> => {
  const query = {
    $or: [{ senderEmail: email }, { receiverEmail: email }]
  };
  const messages: IMessageDocument[] = await MessageModel.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$conversationId',
        result: { $top: { output: '$$ROOT', sortBy: { createdAt: -1 } } }
      }
    },
    {
      $project: {
        _id: '$result._id',
        conversationId: '$result.conversationId',
        sellerId: '$result.sellerId',
        buyerId: '$result.buyerId',
        receiverUsername: '$result.receiverUsername',
        receiverEmail: '$result.receiverEmail',
        receiverPicture: '$result.receiverPicture',
        senderUsername: '$result.senderUsername',
        senderEmail: '$result.senderEmail',
        senderPicture: '$result.senderPicture',
        body: '$result.body',
        file: '$result.file',
        gigId: '$result.gigId',
        isRead: '$result.isRead',
        hasOffer: '$result.hasOffer',
        createdAt: '$result.createdAt'
      }
    }
  ]);
  return messages;
};

export const getMessages = async (senderEmail: string, receiverEmail: string): Promise<IMessageDocument[]> => {
  const query = {
    $or: [
      {
        senderEmail,
        receiverEmail
      },
      {
        senderEmail: receiverEmail,
        receiverEmail: senderEmail
      }
    ]
  };
  const messages: IMessageDocument[] = await MessageModel.aggregate([{ $match: query }, { $sort: { createdAt: 1 } }]);
  return messages;
};

export const getUserMessages = async (messageConversationId: string): Promise<IMessageDocument[]> => {
  const messages: IMessageDocument[] = await MessageModel.aggregate([
    {
      $match: {
        conversationId: messageConversationId
      }
    },
    { $sort: { createdAt: 1 } }
  ]);
  return messages;
};

export const updateOffer = async (messageId: string, type: string): Promise<IMessageDocument> => {
  const message: IMessageDocument = (await MessageModel.findOneAndUpdate(
    { _id: messageId },
    {
      $set: {
        [`offer.${type}`]: true
      }
    },
    {
      new: true
    }
  )) as IMessageDocument;
  return message;
};

export const markMessageAsRead = async (messageId: string): Promise<IMessageDocument> => {
  const message: IMessageDocument = (await MessageModel.findOneAndUpdate(
    { _id: messageId },
    {
      $set: {
        isRead: true
      }
    },
    {
      new: true
    }
  )) as IMessageDocument;
  socketIOChatObject.emit('message updated', message);
  return message;
};

export const markManyMessagesAsRead = async (receiverEmail: string, senderEmail: string, messageId: string): Promise<IMessageDocument> => {
  const updated = await MessageModel.updateMany(
    {
      $or: [
        { senderEmail, receiverEmail },
        { senderEmail: receiverEmail, receiverEmail: senderEmail }
      ],
      isRead: false
    },
    {
      $set: {
        isRead: true
      }
    }
  );
  const message: IMessageDocument = (await MessageModel.findOne({ _id: messageId }).exec()) as IMessageDocument;
  socketIOChatObject.emit('message updated', message);
  return message;
};
