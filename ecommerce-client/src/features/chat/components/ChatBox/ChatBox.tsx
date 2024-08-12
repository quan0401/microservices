import { ChangeEvent, FC, FormEvent, ReactElement, RefObject, useRef, useState } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useAppSelector } from '~/store/store';
import { IReduxState } from '~/store/store.interface';
import useChatScrollToBottom from '~features/chat/hooks/useChatScrollToBottom';
import { IChatBoxProps, IConversationDocument, IMessageDocument } from '~features/chat/interfaces/chat.interface';
import { useGetConversationQuery, useGetMessagesQuery, useSaveChatMessageMutation } from '~features/chat/services/chat.service';
import Button from '~shared/button/Button';
import TextInput from '~shared/inputs/TextInput';
import { IResponse } from '~shared/shared.interface';
import { showErrorToast } from '~shared/utils/utils.service';
import ChatBoxSkeleton from './ChatBoxSkeleton';
import { v4 as uuidv4 } from 'uuid';

const ChatBox: FC<IChatBoxProps> = ({ seller, buyer, gigId, onClose }): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const [message, setMessage] = useState<string>('');
  // const conversationIdRef = useRef<string>(`${generateRandomNumber(15)}`);
  const conversationIdRef = useRef<string>('');
  const { data: conversationData, isSuccess: isConversationSuccess } = useGetConversationQuery({
    senderEmail: `${seller.email}`,
    receiverEmail: `${buyer.email}`
  });

  const {
    data: messageData,
    isLoading: isMessageLoading,
    isSuccess: isMessageSuccess
  } = useGetMessagesQuery(
    {
      senderEmail: `${seller.email}`,
      receiverEmail: `${buyer.email}`
    },
    { refetchOnMountOrArgChange: true }
  );
  let chatMessages: IMessageDocument[] = [];

  if (isConversationSuccess && conversationData.conversations && conversationData.conversations.length) {
    conversationIdRef.current = (conversationData.conversations[0] as IConversationDocument).conversationId;
  }
  if (isMessageSuccess) {
    chatMessages = messageData.messages as IMessageDocument[];
  }
  const scrollRef: RefObject<HTMLDivElement> = useChatScrollToBottom(chatMessages);
  const [saveChatMessage] = useSaveChatMessageMutation();

  const sendMessage = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!message) {
      return;
    }

    try {
      const isAuthUserSeller = authUser.email === seller.email;

      const messageBody: IMessageDocument = {
        conversationId: conversationIdRef.current,
        hasConversationId: !!(conversationData && conversationData.conversations && conversationData.conversations.length),
        body: message,
        gigId,
        sellerId: seller._id,
        buyerId: buyer._id,
        // sender details, if auth User is the seller then the receiver will be the buyer, else other wise
        senderUsername: isAuthUserSeller ? seller.username : buyer.username,
        senderPicture: isAuthUserSeller ? seller.profilePicture : buyer.profilePicture,
        senderEmail: isAuthUserSeller ? seller.email : buyer.email,
        // receiver details
        receiverUsername: isAuthUserSeller ? buyer.username : seller.username,
        receiverEmail: isAuthUserSeller ? buyer.email : seller.email,
        receiverPicture: isAuthUserSeller ? buyer.profilePicture : seller.profilePicture,
        isRead: false,
        hasOffer: false
      };
      const response: IResponse = await saveChatMessage(messageBody).unwrap();
      setMessage('');
      conversationIdRef.current = `${response.conversationId}`;
    } catch (error) {
      showErrorToast('Error sending message.');
    }
  };

  return (
    <>
      {isMessageLoading && !chatMessages ? (
        <ChatBoxSkeleton />
      ) : (
        <div className="border-grey fixed bottom-0 left-2 right-2 h-[400px] max-h-[500px] w-auto border bg-white md:left-8 md:h-96 md:max-h-[500px] md:w-96">
          <div className="border-grey flex items-center space-x-4 border-b px-5 py-2">
            <img
              src={authUser.email === seller.email ? buyer.profilePicture : seller.profilePicture}
              className="h-10 w-10 rounded-full"
              alt="profile image"
            />
            <div className="w-full font-medium text-[#777d74]">
              <div className="flex w-full cursor-pointer justify-between text-sm font-bold text-[#777d74] md:text-base">
                <span>{authUser.email === seller.email ? buyer.username : seller.username}</span>
                <FaTimes className="flex self-center" onClick={onClose} />
              </div>
              <div className="text-xs text-gray-500">
                Avg. response time: {seller?.responseTime} hour{`${seller?.responseTime > 1 ? 's' : ''}`}{' '}
              </div>
            </div>
          </div>

          <div className="h-[500px] overflow-y-scroll md:h-full">
            <div className="my-2 flex h-[280px] flex-col overflow-y-scroll px-4 md:h-[72%]" ref={scrollRef}>
              {chatMessages.map((msg: IMessageDocument) => {
                return (
                  <div
                    key={uuidv4()}
                    className={`my-2 flex max-w-[300px] gap-y-6 text-sm ${
                      msg.senderEmail === authUser.email ? 'flex-row-reverse self-end' : ''
                    }`}
                  >
                    <img
                      src={buyer.profilePicture}
                      className={`h-8 w-8 rounded-full object-cover ${msg.senderUsername !== buyer.username ? 'hidden' : ''}`}
                      alt="profile image"
                    />
                    <p
                      className={`ml-2 max-w-[200px] rounded-[10px] bg-[#e4e6eb] px-4 py-2 text-start text-sm font-normal md:max-w-[220px] ${
                        msg.senderUsername !== buyer.username ? 'max-w-[200px] rounded-[10px] bg-sky-500 text-white' : ''
                      }`}
                    >
                      {msg.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={sendMessage} className="absolute bottom-0 left-0 right-0 mb-1 flex px-2 ">
            <TextInput
              type="text"
              name="message"
              value={message}
              placeholder="Enter your message..."
              className="border-grey mb-0 w-full rounded-l-lg border p-2 text-sm font-normal text-gray-600 focus:outline-none"
              onChange={(e: ChangeEvent) => setMessage((e.target as HTMLInputElement).value)}
            />
            <Button
              className="rounded-r-lg bg-sky-500 px-6 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:px-3 md:text-base"
              label={<FaPaperPlane className="self-center" />}
            />
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBox;
