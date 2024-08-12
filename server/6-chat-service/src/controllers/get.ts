import { getConversation, getMessages, getUserConversationList, getUserMessages } from '~/services/message.service';
import { IConversationDocument, IMessageDocument } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ConversationModel } from '~/models/conversation.schema';

const conversation = async (req: Request, res: Response): Promise<void> => {
  const { senderEmail, receiverEmail } = req.params;
  const conversations: IConversationDocument[] = await getConversation(senderEmail, receiverEmail);
  res.status(StatusCodes.OK).json({ message: 'Chat conversation', conversations });
};

const messages = async (req: Request, res: Response): Promise<void> => {
  const { senderEmail, receiverEmail } = req.params;
  const messages: IMessageDocument[] = await getMessages(senderEmail, receiverEmail);
  res.status(StatusCodes.OK).json({ message: 'Chat messages', messages });
};

const conversationList = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;
  const messages: IMessageDocument[] = await getUserConversationList(email);
  res.status(StatusCodes.OK).json({ message: 'Conversation list', conversations: messages });
};

const userMessages = async (req: Request, res: Response): Promise<void> => {
  const { conversationId } = req.params;
  const messages: IMessageDocument[] = await getUserMessages(conversationId);
  res.status(StatusCodes.OK).json({ message: 'Chat messages', messages });
};

export { conversation, messages, conversationList, userMessages };
