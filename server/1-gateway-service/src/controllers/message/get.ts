import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { messageService } from '~/services/api/message.service';

export class Get {
  public async conversation(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.getConversation(req.params.senderEmail, req.params.receiverEmail);
    res.status(StatusCodes.OK).json({ message: response.data.message, conversations: response.data.conversations });
  }

  public async messages(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await messageService.getMessages(req.params.senderEmail, req.params.receiverEmail);
    res.status(StatusCodes.OK).json({ message: response.data.message, messages: response.data.messages });
  }

  public async conversationList(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const response: AxiosResponse = await messageService.getConversationList(email);
    res.status(StatusCodes.OK).json({ message: response.data.message, conversations: response.data.conversations });
  }

  public async userMessages(req: Request, res: Response): Promise<void> {
    const { conversationId } = req.params;
    const response: AxiosResponse = await messageService.getUserMessages(conversationId);
    res.status(StatusCodes.OK).json({ message: response.data.message, messages: response.data.messages });
  }
}
