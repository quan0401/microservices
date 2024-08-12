import { find } from 'lodash';
import { ChangeEvent, FC, FormEvent, lazy, ReactElement, useEffect, useRef, useState } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { socket, socketService } from '~/sockets/socket.service';
import { IBuyerDocument } from '~features/buyer/interfaces/buyer.interface';
import { useGetBuyerByEmailQuery } from '~features/buyer/services/buyer.service';
import useChatScrollToBottom from '~features/chat/hooks/useChatScrollToBottom';
import { IChatWindowProps, IMessageDocument } from '~features/chat/interfaces/chat.interface';
import { useGetGigByIdQuery } from '~features/gigs/services/gigs.service';
import Button from '~shared/button/Button';
import TextInput from '~shared/inputs/TextInput';
import { checkFile, fileType, readAsBase64 } from '~shared/utils/image-utils.service';
import { TimeAgo } from '~shared/utils/timeago.utils';
import { useAppSelector } from '~/store/store';
import { IReduxState } from '~/store/store.interface';
import ChatFile from './ChatFile';
import { useMarkMultipleMessagesAsReadMutation, useSaveChatMessageMutation } from '~features/chat/services/chat.service';
import { showErrorToast } from '~shared/utils/utils.service';

const ChatImagePreview = lazy(() => import('./ChatImagePreview'));
const OfferModal = lazy(() => import('~shared/modals/OfferModal'));
const ChatOffer = lazy(() => import('./ChatOffer'));

const MESSAGE_STATUS = {
  EMPTY: '',
  IS_LOADING: false,
  LOADING: true
};

const ChatWindow: FC<IChatWindowProps> = ({ chatMessages, isError, isLoading, setSkip }): ReactElement => {
  const seller = useAppSelector((state: IReduxState) => state.seller);
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useChatScrollToBottom([]);
  const { email } = useParams<string>();
  const [receiverEmail, setReceiverEmail] = useState<string | undefined>(MESSAGE_STATUS.EMPTY);
  const receiverRef = useRef<IBuyerDocument>();
  const singleMessageRef = useRef<IMessageDocument>();
  const [showImagePreview, setShowImagePreview] = useState<boolean>(MESSAGE_STATUS.IS_LOADING);
  const [displayCustomOffer, setDisplayCustomOffer] = useState<boolean>(MESSAGE_STATUS.IS_LOADING);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(MESSAGE_STATUS.IS_LOADING);
  const [message, setMessage] = useState<string>(MESSAGE_STATUS.EMPTY);
  const [saveChatMessage] = useSaveChatMessageMutation();
  const [markMultipleMessagesAsRead] = useMarkMultipleMessagesAsReadMutation();

  const { data: buyerData, isSuccess: isBuyerSuccess } = useGetBuyerByEmailQuery(`${email}`);
  const { data } = useGetGigByIdQuery(`${singleMessageRef.current?.gigId}`, { skip: !singleMessageRef.current });

  if (isBuyerSuccess) {
    receiverRef.current = buyerData.buyer;
  }

  if (chatMessages.length) {
    singleMessageRef.current = chatMessages[chatMessages.length - 1];
  }

  const handleFileChange = (e: ChangeEvent): void => {
    const target: HTMLInputElement = e.target as HTMLInputElement;
    if (target.files) {
      const file: File = target.files[0];
      if (!checkFile(file)) {
        setSelectedFile(file);
        setShowImagePreview(MESSAGE_STATUS.LOADING);
      }
    }
  };

  const setChatMessage = (e: ChangeEvent): void => {
    setMessage((e.target as HTMLInputElement).value);
  };

  const sendMessage = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (setSkip) {
      setSkip(true);
    }
    if (!message && !selectedFile) return;
    try {
      setIsUploadingFile(MESSAGE_STATUS.LOADING);
      const messageBody: IMessageDocument = {
        conversationId: singleMessageRef?.current?.conversationId,
        hasConversationId: true,
        body: message,
        gigId: singleMessageRef?.current?.gigId,
        sellerId: singleMessageRef?.current?.sellerId,
        buyerId: singleMessageRef?.current?.buyerId,
        senderUsername: `${authUser?.username}`,
        senderPicture: `${authUser?.profilePicture}`,
        senderEmail: `${authUser.email}`,
        receiverUsername: receiverRef?.current?.username,
        receiverPicture: receiverRef?.current?.profilePicture,
        receiverEmail: `${receiverRef?.current?.email}`,
        isRead: false,
        hasOffer: false
      };
      if (selectedFile) {
        const dataImage: string | ArrayBuffer | null = await readAsBase64(selectedFile);
        messageBody.file = dataImage as string;
        messageBody.body = messageBody.body ? messageBody.body : '1 file sent';
        messageBody.fileType = fileType(selectedFile);
        messageBody.fileName = selectedFile.name;
        messageBody.fileSize = `${selectedFile.size}`;
      }
      // this will make Chat.tsx re-render
      await saveChatMessage(messageBody).unwrap();
      setSelectedFile(null);
      setShowImagePreview(MESSAGE_STATUS.IS_LOADING);
      setMessage(MESSAGE_STATUS.EMPTY);
      setIsUploadingFile(MESSAGE_STATUS.IS_LOADING);
    } catch (error) {
      setMessage(MESSAGE_STATUS.EMPTY);
      setIsUploadingFile(MESSAGE_STATUS.IS_LOADING);
      showErrorToast('Error sending message.');
    }
  };

  useEffect(() => {
    socketService.setupSocketConnection();
    if (receiverRef.current?.email) {
      socket.emit('getLoggedInUsers');
      socket.on('online', (data: string[]) => {
        setReceiverEmail(find(data, (email: string) => email === receiverRef.current?.email));
      });
    }
  }, [receiverRef?.current?.email]);

  useEffect(() => {
    const hanleMarkAsRead = async () => {
      const receiverEmail = `${singleMessageRef.current?.receiverEmail}`;
      const senderEmail = `${singleMessageRef.current?.senderEmail}`;
      if (receiverEmail === authUser.email && !singleMessageRef.current?.isRead) {
        await markMultipleMessagesAsRead({
          receiverEmail,
          senderEmail,
          messageId: `${singleMessageRef.current?._id}`
        });
      }
    };
    window.addEventListener('focus', hanleMarkAsRead);

    return () => window.removeEventListener('focus', hanleMarkAsRead);
  }, [singleMessageRef.current?._id]);

  return (
    <>
      {!isLoading && displayCustomOffer && (
        <OfferModal
          header="Create Custom Offer"
          gigTitle={data && data?.gig?.title && singleMessageRef.current?.sellerId === seller._id ? data?.gig.title : ''}
          singleMessage={singleMessageRef.current}
          receiver={receiverRef.current}
          authUser={authUser}
          seller={seller}
          cancelBtnHandler={() => setDisplayCustomOffer(MESSAGE_STATUS.IS_LOADING)}
        />
      )}
      {!isLoading && (
        <div className="flex min-h-full w-full flex-col">
          <div className="border-grey flex w-full flex-col border-b px-5 py-0.5 ">
            {receiverEmail === receiverRef.current?.email ? (
              <>
                <div className="text-lg font-semibold">{receiverRef?.current?.username}</div>
                <div className="flex gap-1 pb-1 text-xs font-normal">
                  Online
                  <span className="flex h-2.5 w-2.5 self-center rounded-full border-2 border-white bg-green-400"></span>
                </div>
              </>
            ) : (
              <>
                <div className="py-2.5 text-lg font-semibold">{receiverRef?.current?.username}</div>
                <span className="py-2.5s text-xs font-normal"></span>
              </>
            )}
          </div>
          <div className="relative h-[100%]">
            <div className="absolute flex h-[98%] w-screen grow flex-col overflow-scroll" ref={scrollRef}>
              {chatMessages.map((msg: IMessageDocument) => (
                <div key={uuidv4()} className="mb-4">
                  <div className="flex w-full cursor-pointer items-center space-x-4 px-5 py-2 hover:bg-[#f5fbff]">
                    <div className="flex self-start">
                      <img className="h-10 w-10 object-cover rounded-full" src={msg.senderPicture} alt="" />
                    </div>
                    <div className="w-full text-sm dark:text-white">
                      <div className="flex gap-x-2 pb-1 font-bold text-[#777d74]">
                        <span>{msg.senderUsername}</span>
                        <span className="mt-1 self-center text-xs font-normal">{TimeAgo.dayMonthYear(`${msg.createdAt}`)}</span>
                      </div>
                      <div className="flex flex-col text-[#777d74] font-extrabold">
                        <span>{msg.body}</span>
                        {msg.hasOffer && <ChatOffer message={msg} seller={seller} gig={data?.gig} />}
                        {msg.file && <ChatFile message={msg} />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex flex-col">
            {showImagePreview && (
              <ChatImagePreview
                image={URL.createObjectURL(selectedFile as File)}
                file={selectedFile as File}
                isLoading={isUploadingFile}
                message={message}
                onSubmit={sendMessage}
                onRemoveImage={() => {
                  setSelectedFile(null);
                  setShowImagePreview(MESSAGE_STATUS.IS_LOADING);
                }}
                handleChange={setChatMessage}
              />
            )}

            {!showImagePreview && (
              <div className="bottom-0 left-0 right-0 z-0 h-28 px-4 ">
                <form onSubmit={sendMessage} className="mb-1 w-full">
                  <TextInput
                    type="text"
                    name="message"
                    value={message}
                    className="border-grey mb-1 w-full rounded border p-3.5 text-sm font-normal text-gray-600 focus:outline-none"
                    placeholder="Enter your message..."
                    onChange={(e: ChangeEvent) => setMessage((e.target as HTMLInputElement).value)}
                  />
                </form>
                <div className="flex cursor-pointer flex-row justify-between">
                  <div className="flex gap-4">
                    {!showImagePreview && <FaPaperclip className="mt-1 self-center" onClick={() => fileRef.current?.click()} />}
                    {!showImagePreview && !!seller._id && (
                      <Button
                        className="rounded bg-sky-500 px-6 py-3 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:px-4 md:py-2 md:text-base"
                        disabled={false}
                        label="Add Offer"
                        onClick={() => setDisplayCustomOffer(MESSAGE_STATUS.LOADING)}
                      />
                    )}
                    <TextInput
                      name="chatFile"
                      ref={fileRef}
                      type="file"
                      style={{ display: 'none' }}
                      onClick={() => {
                        if (fileRef.current) {
                          fileRef.current.value = '';
                        }
                      }}
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      className="rounded bg-sky-500 px-6 py-3 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:px-4 md:py-2 md:text-base"
                      disabled={false}
                      label={<FaPaperPlane className="self-center" />}
                      onClick={sendMessage}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWindow;
