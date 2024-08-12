import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import ChatList from './chatList/ChatList';
import { useParams } from 'react-router-dom';
import { IMessageDocument } from '../interfaces/chat.interface';
import { useGetUserMessagesQuery } from '../services/chat.service';
import { chatMessageReceived } from '../services/chat.utils';
import ChatWindow from './chatWindow/ChatWindow';

const Chat: FC = (): ReactElement => {
  const { conversationId } = useParams();
  const chatMessages = useRef<IMessageDocument[]>([]);
  const [skip, setSkip] = useState<boolean>(false);
  const [chatMessagesData, setChatMessagesData] = useState<IMessageDocument[]>([]);
  // using skip: true, to prevent calling when sending message
  const { data, isSuccess, isLoading, isError } = useGetUserMessagesQuery(`${conversationId}`, { skip });

  useEffect(() => {
    if (isSuccess) {
      setChatMessagesData(data?.messages as IMessageDocument[]);
    }
  }, [isSuccess, data?.messages]);

  useEffect(() => {
    // remove duplicates messages, socket may send couple of times
    chatMessageReceived(`${conversationId}`, chatMessagesData, chatMessages.current, setChatMessagesData);
  }, [chatMessagesData, conversationId]);

  return (
    <div className="border-grey mx-2 my-5 flex max-h-[90%] flex-wrap border lg:container lg:mx-auto">
      <div className="lg:border-grey relative w-full overflow-hidden lg:w-1/3 lg:border-r">
        <ChatList setSkip={setSkip} />
      </div>

      <div className="relative hidden w-full overflow-hidden md:w-2/3 lg:flex">
        {conversationId && chatMessagesData.length > 0 ? (
          <ChatWindow setSkip={setSkip} chatMessages={chatMessagesData} isLoading={isLoading} isError={isError} />
        ) : (
          <div className="flex w-full items-center justify-center">Select a user to chat with.</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
