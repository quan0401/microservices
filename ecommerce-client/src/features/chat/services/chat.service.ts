import { IResponse } from '~shared/shared.interface';
import { api } from '~/store/api';

import { IMessageDocument } from '../interfaces/chat.interface';

export const chatApi = api.injectEndpoints({
  endpoints: (build) => ({
    getConversation: build.query<IResponse, { senderEmail: string; receiverEmail: string }>({
      query: ({ senderEmail, receiverEmail }) => `message/conversation/${senderEmail}/${receiverEmail}`,
      providesTags: ['Chat']
    }),
    getMessages: build.query<IResponse, { senderEmail: string; receiverEmail: string }>({
      query: ({ senderEmail, receiverEmail }) => `message/${senderEmail}/${receiverEmail}`,
      providesTags: ['Chat']
    }),
    getConversationList: build.query<IResponse, string>({
      query: (email: string) => `message/conversations/${email}`,
      providesTags: ['Chat']
    }),
    getUserMessages: build.query<IResponse, string>({
      query: (conversationId: string) => `message/${conversationId}`,
      providesTags: ['Chat']
    }),
    saveChatMessage: build.mutation<IResponse, IMessageDocument>({
      query(body: IMessageDocument) {
        return {
          url: 'message',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Chat']
    }),
    updateOffer: build.mutation<IResponse, { messageId: string; type: string }>({
      query({ messageId, type }) {
        return {
          url: 'message/offer',
          method: 'PUT',
          body: { messageId, type }
        };
      },
      invalidatesTags: ['Chat']
    }),
    markMessagesAsRead: build.mutation<IResponse, string>({
      query(messageId: string) {
        return {
          url: 'message/mark-as-read',
          method: 'PUT',
          body: { messageId }
        };
      },
      invalidatesTags: ['Chat']
    }),
    markMultipleMessagesAsRead: build.mutation<IResponse, { receiverEmail: string; senderEmail: string; messageId: string }>({
      query({ receiverEmail, senderEmail, messageId }) {
        return {
          url: 'message/mark-multiple-as-read',
          method: 'PUT',
          body: { receiverEmail, senderEmail, messageId }
        };
      },
      invalidatesTags: ['Chat']
    })
  })
});

export const {
  useGetConversationQuery,
  useGetMessagesQuery,
  useGetConversationListQuery,
  useGetUserMessagesQuery,
  useSaveChatMessageMutation,
  useUpdateOfferMutation,
  useMarkMessagesAsReadMutation,
  useMarkMultipleMessagesAsReadMutation
} = chatApi;
