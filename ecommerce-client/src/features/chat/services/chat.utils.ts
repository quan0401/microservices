import { AnyAction } from '@reduxjs/toolkit';
import { cloneDeep, filter, find, findIndex, remove } from 'lodash';
import { Dispatch, SetStateAction } from 'react';
// import { updateNotification } from '~shared/header/reducers/notification.reducer';
import { lowerCase } from 'src/shared/utils/utils.service';
import { socket } from 'src/sockets/socket.service';

import { IMessageDocument } from '../interfaces/chat.interface';

export const chatMessageReceived = (
  conversationId: string,
  chatMessagesData: IMessageDocument[],
  chatMessages: IMessageDocument[],
  setChatMessagesData: Dispatch<SetStateAction<IMessageDocument[]>>
): void => {
  // receive message from anyone
  socket.on('message received', (data: IMessageDocument) => {
    chatMessages = cloneDeep(chatMessagesData);
    if (data.conversationId === conversationId) {
      // chatMessages.push(data);
      // const uniqe = chatMessages.filter((item: IMessageDocument, index: number, list: IMessageDocument[]) => {
      //   console.log('list:::', list);
      //   const itemIndex = list.findIndex((listItem: IMessageDocument) => listItem._id === item._id);
      //   return itemIndex === index;
      // });
      // setChatMessagesData(uniqe);
      const foundIndex = chatMessages.findIndex((msg: IMessageDocument) => msg._id === data._id);
      if (foundIndex < 0) {
        setChatMessagesData([...chatMessages, data]);
      }
    }
  });
};

export const chatListMessageReceived = (
  username: string,
  chatList: IMessageDocument[],
  conversationListRef: IMessageDocument[],
  dispatch: Dispatch<AnyAction>,
  setChatList: Dispatch<SetStateAction<IMessageDocument[]>>
): void => {
  socket.on('message received', (data: IMessageDocument) => {
    conversationListRef = cloneDeep(chatList);
    if (
      lowerCase(`${data.receiverUsername}`) === lowerCase(`${username}`) ||
      lowerCase(`${data.senderUsername}`) === lowerCase(`${username}`)
    ) {
      const messageIndex = findIndex(chatList, ['conversationId', data.conversationId]);
      if (messageIndex > -1) {
        remove(conversationListRef, (chat: IMessageDocument) => chat.conversationId === data.conversationId);
      } else {
        remove(conversationListRef, (chat: IMessageDocument) => chat.receiverUsername === data.receiverUsername);
      }
      conversationListRef = [data, ...conversationListRef];
      if (lowerCase(`${data.receiverUsername}`) === lowerCase(`${username}`)) {
        const list: IMessageDocument[] = filter(
          conversationListRef,
          (item: IMessageDocument) => !item.isRead && item.receiverUsername === username
        );
        // dispatch(updateNotification({ hasUnreadMessage: list.length > 0 }));
      }
      setChatList(conversationListRef);
    }
  });
};

export const chatListMessageUpdated = (
  username: string,
  chatList: IMessageDocument[],
  conversationListRef: IMessageDocument[],
  dispatch: Dispatch<AnyAction>,
  setChatList: Dispatch<SetStateAction<IMessageDocument[]>>
): void => {
  socket.on('message updated', (data: IMessageDocument) => {
    conversationListRef = cloneDeep(chatList);
    if (
      lowerCase(`${data.receiverUsername}`) === lowerCase(`${username}`) ||
      lowerCase(`${data.senderUsername}`) === lowerCase(`${username}`)
    ) {
      const messageIndex = findIndex(chatList, ['conversationId', data.conversationId]);
      if (messageIndex > -1) {
        conversationListRef.splice(messageIndex, 1, data);
      }
      if (lowerCase(`${data.receiverUsername}`) === lowerCase(`${username}`)) {
        const list: IMessageDocument[] = filter(
          conversationListRef,
          (item: IMessageDocument) => !item.isRead && item.receiverUsername === username
        );
        // dispatch(updateNotification({ hasUnreadMessage: list.length > 0 }));
      }
      setChatList(conversationListRef);
    }
  });
};
