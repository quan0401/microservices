import { orderBy } from 'lodash';
import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { FaCheckDouble, FaCircle } from 'react-icons/fa';
import { Location, NavigateFunction, useLocation, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { socket } from '~/sockets/socket.service';
import { useAppDispatch, useAppSelector } from '~/store/store';
import { IReduxState } from '~/store/store.interface';
import { IChatListProps, IMessageDocument } from '~features/chat/interfaces/chat.interface';
import { useGetConversationListQuery, useMarkMultipleMessagesAsReadMutation } from '~features/chat/services/chat.service';
import { updateNotification } from '~shared/header/reducers/notification.reducer';
import { TimeAgo } from '~shared/utils/timeago.utils';
import { lowerCase, showErrorToast } from '~shared/utils/utils.service';

const ChatList: FC<IChatListProps> = ({ setSkip }): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const [selectedUser, setSelectedUser] = useState<IMessageDocument>();
  const conversationsListRef = useRef<IMessageDocument[]>([]);
  const [chatList, setChatList] = useState<IMessageDocument[]>([]);
  const { email, conversationId } = useParams<string>();
  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();
  const dispatch = useAppDispatch();
  const { data, isSuccess, refetch } = useGetConversationListQuery(`${authUser.email}`);
  const [markMultipleMessagesAsRead] = useMarkMultipleMessagesAsReadMutation();

  const selectUserFromList = async (user: IMessageDocument): Promise<void> => {
    try {
      setSelectedUser(user);
      const pathList: string[] = location.pathname.split('/');
      // remove the last two items
      pathList.splice(-2, 2);
      const locationPathName: string = !pathList.join('/') ? location.pathname : pathList.join('/');
      const chatEmail: string = (user.receiverEmail === authUser.email ? user.senderEmail : user.receiverEmail) as string;
      if (setSkip) {
        //  set reload to false to reload, incase it's true it wont fetch new messages
        setSkip(false);
      }
      navigate(`${locationPathName}/${lowerCase(chatEmail)}/${user.conversationId}`);
      socket.emit('getLoggedInUsers', '');
      if (user.receiverEmail === authUser.email && !user.isRead) {
        await markMultipleMessagesAsRead({
          receiverEmail: authUser.email,
          senderEmail: `${user.senderEmail}`,
          messageId: `${user._id}`
        });
      }
    } catch (error) {
      showErrorToast('Error selecting chat user.');
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const sortedConversatinos: IMessageDocument[] = orderBy(data.conversations, ['createdAt'], ['desc']) as IMessageDocument[];
      setChatList(sortedConversatinos);
      if (!sortedConversatinos.length) {
        dispatch(updateNotification({ hasUnreadMessage: false }));
      }
      // dispatch update notification
    }
  }, [isSuccess, data?.conversations, dispatch, email]);

  useEffect(() => {
    socket.on('message received', (newMsg: IMessageDocument) => {
      if (newMsg.receiverEmail === authUser.email) {
        refetch();
      }
    });
  }, []);

  return (
    <>
      <div className="border-grey truncate border-b px-5 py-3 text-base font-medium">
        <h2 className="w-6/12 truncate text-sm md:text-base lg:text-lg">All Conversations</h2>
      </div>
      <div className="absolute h-full w-full overflow-scroll pb-14">
        {chatList.map((data: IMessageDocument, index: number) => {
          return (
            <div
              key={uuidv4()}
              onClick={() => selectUserFromList(data)}
              className={`flex w-full cursor-pointer items-center space-x-4 px-5 py-4 hover:bg-gray-50 ${
                index !== chatList.length - 1 ? 'border-grey border-b' : ''
              }  ${data.conversationId === conversationId ? 'bg-[#f5fbff]' : ''}`}
            >
              <img
                src={data.receiverEmail === authUser.email ? data.senderPicture : data.receiverPicture}
                alt="profile image"
                className="h-10 w-10 object-cover rounded-full"
                // placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
                // effect="blur"
              />
              {/* <div className="w-full text-sm dark:text-white"> */}
              <div
                className={`w-full text-sm font-extrabold ${!data.isRead && data.receiverEmail === authUser.email ? 'text-black' : 'text-[#777d74]'}`}
              >
                <div className="flex justify-between pb-1 font-bold">
                  <span className={`${selectedUser && !data.body ? 'flex items-center' : ''}`}>
                    {data.receiverEmail === authUser.email ? data.senderUsername : data.receiverUsername}
                  </span>
                  {data.createdAt && <span className="font-normal">{TimeAgo.transform(`${data.createdAt}`)}</span>}
                </div>
                <div className="flex justify-between">
                  <span>
                    {data.receiverEmail === authUser.email ? '' : 'Me: '}
                    {data.body}
                  </span>

                  {!data.isRead ? (
                    <>{data.receiverEmail === authUser.email ? <FaCircle className="mt-2 text-sky-500" size={8} /> : <></>}</>
                  ) : (
                    <FaCheckDouble className="mt-2 text-sky-500" size={8} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ChatList;
