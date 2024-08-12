import crypto from 'crypto';
import { messageSchema } from '~/schemes/message.scheme';
import { BadRequestError, IConversationDocument, IMessageDocument, uploads } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { addMessage, conversationBetweenTwoUsersExisted, createConversation } from '~/services/message.service';
import { StatusCodes } from 'http-status-codes';
import { config } from '~/config';
import mongoose from 'mongoose';

const message = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(messageSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Create message() method');
  }
  let file: string = req.body.file;
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  let result: UploadApiResponse;
  if (file) {
    result = (
      req.body.fileType === 'zip'
        ? await uploads(file, `${config.CLOUD_FOLDER}`, `${randomCharacters}.zip`)
        : await uploads(file, `${config.CLOUD_FOLDER}`)
    ) as UploadApiResponse;
    if (!result.public_id) {
      throw new BadRequestError('File upload error. Try again', 'Create message() method');
    }
    file = result?.secure_url;
  }
  // Ensure offer fields are booleans if they exist
  if (req.body.offer) {
    req.body.offer.accepted = req.body.offer.accepted === '' ? false : req.body.offer.accepted;
    req.body.offer.cancelled = req.body.offer.cancelled === '' ? false : req.body.offer.cancelled;
  }
  const messageData: IMessageDocument = {
    conversationId: req.body.conversationId,
    body: req.body.body,
    file,
    fileType: req.body.fileType,
    fileSize: req.body.fileSize,
    fileName: req.body.fileName,
    gigId: req.body.gigId,
    buyerId: req.body.buyerId,
    sellerId: req.body.sellerId,
    senderUsername: req.body.senderUsername,
    senderEmail: req.body.senderEmail,
    senderPicture: req.body.senderPicture,
    receiverUsername: req.body.receiverUsername,
    receiverEmail: req.body.receiverEmail,
    receiverPicture: req.body.receiverPicture,
    isRead: req.body.isRead ? req.body.isRead : false,
    hasOffer: req.body.hasOffer ? req.body.hasOffer : false,
    offer: req.body.offer
  };

  const conversationData: IConversationDocument = {
    conversationId: req.body.conversationId,
    senderUsername: req.body.senderUsername,
    receiverUsername: req.body.receiverUsername,
    senderEmail: req.body.senderEmail,
    receiverEmail: req.body.receiverEmail
  } as IConversationDocument;

  if (!req.body.hasConversationId) {
    conversationData.conversationId = new mongoose.Types.ObjectId().toString();
    const created = await createConversation(conversationData);
    messageData.conversationId = created.conversationId;
  } else if (!req.body.conversationId) {
    throw new BadRequestError('Required conversationId when hasConversationId is true', 'ChatService create message');
  }
  const message: IMessageDocument = await addMessage(messageData);
  res.status(StatusCodes.OK).json({ message: 'Message added', conversationId: req.body.conversationId, messageData: message });
};

export { message };
