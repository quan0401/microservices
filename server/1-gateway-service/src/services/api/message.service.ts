import axios, { AxiosResponse } from 'axios';
import { AxiosService } from '~/services/axios';
import { config } from '~/config';
import { IMessageDocument } from '@quan0401/ecommerce-shared';

export let axiosMessageInstance: ReturnType<typeof axios.create>;

class MessageService {
  constructor() {
    const axiosService: AxiosService = new AxiosService(`${config.MESSAGE_BASE_URL}/api/v1/message`, 'message');
    axiosMessageInstance = axiosService.axios;
  }

  async getConversation(senderEmail: string, receiverEmail: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.get(`/conversation/${senderEmail}/${receiverEmail}`);
    return response;
  }

  async getMessages(senderEmail: string, receiverEmail: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.get(`/${senderEmail}/${receiverEmail}`);
    return response;
  }

  async getConversationList(email: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.get(`/conversations/${email}`);
    return response;
  }

  async getUserMessages(conversationId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.get(`/${conversationId}`);
    return response;
  }

  async addMessage(body: IMessageDocument): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.post('/', body);
    return response;
  }

  async updateOffer(messageId: string, type: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.put('/offer', { messageId, type });
    return response;
  }

  async markMessageAsRead(messageId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.put('/mark-as-read', { messageId });
    return response;
  }

  async markMultipleMessagesAsRead(receiverEmail: string, senderEmail: string, messageId: string): Promise<AxiosResponse> {
    const response: AxiosResponse = await axiosMessageInstance.put('/mark-multiple-as-read', {
      receiverEmail,
      senderEmail,
      messageId
    });
    return response;
  }
}

export const messageService: MessageService = new MessageService();
