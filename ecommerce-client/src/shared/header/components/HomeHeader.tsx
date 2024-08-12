import { Transition } from '@headlessui/react';
import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { IHomeHeaderProps, INotification } from '../interfaces/header.interface';
import Button from '~shared/button/Button';
import { FaAngleLeft, FaAngleRight, FaBars, FaRegBell, FaRegEnvelope, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { categories, replaceSpacesWithDash, showErrorToast, showSuccessToast } from '~shared/utils/utils.service';
import { useAppDispatch, useAppSelector } from '~/store/store';
import { IReduxState } from '~/store/store.interface';
import { ISellerDocument } from '~features/seller/interfaces/seller.interface';
import { IAuthUser } from '~features/auth/interfaces/auth.interface';
import { IBuyerDocument } from '~features/buyer/interfaces/buyer.interface';
import { useResendEmailMutation } from '~features/auth/services/auth.service';
import { IResponse } from '~shared/shared.interface';
import { addAuthUser } from '~features/auth/reducers/auth.reducer';
import Banner from '~shared/banner/Banner';
import useDetectOutsideClick from '~shared/hooks/useDetectOutsideClick';
import SettingsDropdown from './SettingsDropdown';
import { updateCategoryContainer } from '../reducers/category.reducer';
import { updateHeader } from '../reducers/header.reducer';
import HeaderSearchInput from './HeaderSearchInput';
import MessageDropDown from './MessageDropDown';
import { find } from 'lodash';
import { socketService, socket } from '~/sockets/socket.service';
import { IMessageDocument } from '~features/chat/interfaces/chat.interface';
import { IOrderNotifcation } from '~features/order/interfaces/order.interface';
import { updateNotification } from '../reducers/notification.reducer';
import HomeHeaderSideBar from './mobile/HomeHeaderSideBar';
import MobileHeaderSearchInput from './mobile/MobileHeaderSearchInput';
import OrderDropdown from './OrderDropdown';
import NotificationDropdown from './NotificationDropdown';

const HomeHeader: FC<IHomeHeaderProps> = ({ showCategoryContainer }): ReactElement => {
  const authUser: IAuthUser = useAppSelector((state: IReduxState) => state.authUser);
  const seller: ISellerDocument = useAppSelector((state: IReduxState) => state.seller);
  const logout: boolean = useAppSelector((state: IReduxState) => state.logout);
  const buyer: IBuyerDocument = useAppSelector((state: IReduxState) => state.buyer);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const notification: INotification = useAppSelector((state: IReduxState) => state.notification);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>('');
  const dispatch = useAppDispatch();
  const [resendEmail] = useResendEmailMutation();

  // Ref
  const settingsDropdownRef = useRef<HTMLDivElement | null>(null);
  const messageDropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationDropdownRef = useRef<HTMLDivElement | null>(null);
  const orderDropdownRef = useRef<HTMLDivElement | null>(null);
  const navElement = useRef<HTMLDivElement | null>(null);

  const [isSettingsDropdown, setIsSettingDropdown] = useDetectOutsideClick(settingsDropdownRef, false);
  const [isMessageDropdownOpen, setIsMessageDropdownOpen] = useDetectOutsideClick(messageDropdownRef, false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useDetectOutsideClick(notificationDropdownRef, false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useDetectOutsideClick(orderDropdownRef, false);

  const onResendEmail = async (): Promise<void> => {
    try {
      const result: IResponse = await resendEmail({ userId: `${authUser.id}`, email: `${authUser.email}` }).unwrap();

      dispatch(addAuthUser({ authInfo: result.user }));
      showSuccessToast('Email sent successfully.');
    } catch (error) {
      // Show error toast
      showErrorToast('Error sending');
    }
  };

  const toggleDropDown = (): void => {
    setIsSettingDropdown(!isSettingsDropdown);
    setIsMessageDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
    setIsOrderDropdownOpen(false);
  };

  const toggleMessageDropdown = (): void => {
    setIsSettingDropdown(false);
    setIsMessageDropdownOpen(!isMessageDropdownOpen);
    setIsNotificationDropdownOpen(false);
    setIsOrderDropdownOpen(false);
  };

  const toggleOrdersDropdown = (): void => {
    setIsOrderDropdownOpen(!isOrderDropdownOpen);
    setIsMessageDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
    setIsSettingDropdown(false);
    dispatch(updateHeader('home'));
    dispatch(updateCategoryContainer(true));
  };

  const toggleNotificationDropdown = (): void => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsOrderDropdownOpen(false);
    setIsMessageDropdownOpen(false);
    setIsSettingDropdown(false);
    dispatch(updateHeader('home'));
    dispatch(updateCategoryContainer(true));
  };

  useEffect(() => {
    socketService.setupSocketConnection();
    socket.emit('getLoggedInUsers', '');
    // if (isSuccess) {
    //   const list: IOrderNotifcation[] = filter(
    //     data.notifications,
    //     (item: IOrderNotifcation) => !item.isRead && item.userTo === authUser?.username
    //   );
    //   dispatch(updateNotification({ hasUnreadNotification: list.length > 0 }));
    // }
  }, [authUser.email, dispatch]);

  useEffect(() => {
    socket.on('message received', (data: IMessageDocument) => {
      // only for receiver
      if (data.receiverEmail === `${authUser.email}` && !data.isRead) {
        dispatch(updateNotification({ hasUnreadMessage: true }));
      }
    });

    socket.on('order notification', (_, data: IOrderNotifcation) => {
      // only for receiver
      if (data.userTo === `${authUser.email}` && !data.isRead) {
        dispatch(updateNotification({ hasUnreadNotification: true }));
      }
    });

    socket.on('online', (data: string[]) => {
      const email = find(data, (email: string) => email === authUser.email);
      setAuthEmail(`${email}`);
    });
  }, [authUser.email, dispatch]);

  return (
    <>
      {openSidebar && <HomeHeaderSideBar setOpenSidebar={setOpenSidebar} />}
      <header>
        <nav className="navbar peer-checked:navbar-active relative z-[120] w-full border-b bg-white shadow-2xl shadow-gray-600/5 backdrop-blur dark:shadow-none">
          {!logout && authUser && !authUser.emailVerified && (
            <Banner
              onClick={async () => {
                await onResendEmail();
                setEmailSent(true);
              }}
              bgColor="bg-warning"
              showLink={true}
              linkText="Resend email"
              // text="Please verify email before you proceed"
              text={
                !emailSent
                  ? 'Please verify email before you proceed'
                  : 'Please verify email before you proceed, email just sent check your inbox'
              }
            />
          )}

          <div className="m-auto px-6 xl:container md:px-12 lg:px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 md:gap-0 md:py-3 lg:py-3">
              <div className="flex w-full gap-x-4 lg:w-6/12">
                <div className="hidden w-full md:flex">
                  <label htmlFor="hbr" className="peer-checked:hamburger relative z-20 -ml-4 block cursor-pointer p-2 lg:hidden">
                    <Button
                      className="m-auto flex items-center rounded transition duration-300"
                      onClick={() => setOpenSidebar(!openSidebar)}
                      label={
                        <>{openSidebar ? <FaTimes className="h-6 w-6 text-sky-500 " /> : <FaBars className="h-6 w-6 text-sky-500 " />}</>
                      }
                    />
                  </label>
                  <div className="w-full gap-x-4 md:flex">
                    <Link
                      to="/"
                      onClick={() => {
                        dispatch(updateCategoryContainer(true));
                        dispatch(updateHeader('home'));
                      }}
                      className="relative z-10 flex cursor-pointer justify-center self-center text-2xl font-semibold text-black lg:text-3xl"
                    >
                      Ecommerce
                    </Link>
                    <HeaderSearchInput />
                  </div>
                </div>
                {/* <!-- Add MobileHeaderSearchInput component here --> */}
                <MobileHeaderSearchInput setOpenSidebar={setOpenSidebar} />
              </div>
              <div className="navmenu mb-16 hidden w-full cursor-pointer flex-wrap items-center justify-end space-y-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl shadow-gray-300/20 dark:border-gray-700  dark:shadow-none md:flex-nowrap lg:m-0 lg:flex lg:w-6/12 lg:space-y-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
                <div className="text-[#74767e] lg:pr-4">
                  <ul className="flex text-base font-medium">
                    <li className="relative z-50 flex cursor-pointer items-center">
                      <Button
                        className="px-4"
                        onClick={toggleNotificationDropdown}
                        label={
                          <>
                            <FaRegBell />
                            {notification && notification.hasUnreadNotification && (
                              <span className="absolute -top-0 right-0 mr-3 inline-flex h-[6px] w-[6px] items-center justify-center rounded-full bg-[#ff62ab]"></span>
                            )}
                          </>
                        }
                      />
                      <Transition
                        ref={notificationDropdownRef}
                        show={isNotificationDropdownOpen}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <div className="absolute right-0 mt-5 w-96">
                          <NotificationDropdown setIsNotificationDropdownOpen={setIsNotificationDropdownOpen} />
                        </div>
                      </Transition>
                    </li>
                    <li className="relative z-50 flex cursor-pointer items-center">
                      <Button
                        className="relative px-4"
                        onClick={toggleMessageDropdown}
                        label={
                          <>
                            <FaRegEnvelope />
                            {notification && notification.hasUnreadMessage && (
                              <span className="absolute -top-1 right-0 mr-2 inline-flex h-[6px] w-[6px] items-center justify-center rounded-full bg-[#ff62ab]"></span>
                            )}
                          </>
                        }
                      />
                      <Transition
                        ref={messageDropdownRef}
                        show={isMessageDropdownOpen}
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        {/* <div className="absolute right-0 mt-5 w-96"> */}
                        <div className="absolute right-0 mt-5 w-96">
                          <MessageDropDown setIsDropdownOpen={setIsMessageDropdownOpen} />
                        </div>
                      </Transition>
                    </li>
                    <li className="relative z-50 flex cursor-pointer items-center" onClick={toggleOrdersDropdown}>
                      <Button
                        className="px-3"
                        label={
                          <>
                            <span>Orders</span>
                          </>
                        }
                      />
                      <Transition
                        ref={orderDropdownRef}
                        show={isOrderDropdownOpen}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <div className="absolute right-0 mt-5 w-96">
                          <OrderDropdown buyer={buyer} setIsOrderDropdownOpen={setIsOrderDropdownOpen} />
                        </div>
                      </Transition>
                    </li>
                    {buyer && !buyer.isSeller && (
                      <li className="relative flex items-center">
                        <Link
                          to="/seller_onboarding"
                          className="relative ml-auto flex h-9 items-center justify-center rounded-full bg-sky-500 text-white font-bold sm:px-6 hover:bg-sky-400"
                        >
                          {/* <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">Become a Seller</span> */}
                          <span className="text-sm">Become a seller</span>
                        </Link>
                      </li>
                    )}
                    <li className="relative z-50 flex cursor-pointer items-center">
                      <Button
                        className="relative flex gap-2 px-3 text-base font-medium"
                        onClick={toggleDropDown}
                        label={
                          <>
                            <img src={`${authUser.profilePicture}`} alt="profile" className="h-7 w-7 rounded-full object-cover" />
                            {authEmail === authUser.email && (
                              <span className="absolute bottom-0 left-8 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400"></span>
                            )}
                            <span className="flex self-center">{authUser.username}</span>
                          </>
                        }
                      />
                      <Transition
                        ref={settingsDropdownRef}
                        show={isSettingsDropdown}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <div className="absolute -right-48 z-50 mt-5 w-96">
                          <SettingsDropdown
                            seller={seller}
                            buyer={buyer}
                            authUser={authUser}
                            type="buyer"
                            setIsDropdownOpen={setIsSettingDropdown}
                          />
                        </div>
                      </Transition>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {showCategoryContainer && (
            <div className="border-grey z-40 hidden w-full border border-x-0 border-b-0 sm:flex">
              <div className="justify-left md:justify-left container mx-auto flex px-6 lg:justify-center">
                <span className="flex w-auto cursor-pointer self-center pr-1 xl:hidden">
                  <FaAngleLeft size={20} />
                </span>
                <div
                  ref={navElement}
                  className="relative inline-block h-full w-full items-center gap-6 overflow-x-auto scroll-smooth whitespace-nowrap py-2 text-sm font-medium lg:flex lg:justify-between"
                >
                  {categories().map((category: string, index: number) => (
                    <span key={index} className="mx-4 cursor-pointer first:ml-0 hover:text-sky-400 lg:mx-0">
                      <Link to={`/categories/${replaceSpacesWithDash(category)}`}>{category}</Link>
                    </span>
                  ))}
                </div>
                <span className="flex w-auto cursor-pointer self-center pl-1 xl:hidden">
                  <FaAngleRight size={20} />
                </span>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default HomeHeader;
