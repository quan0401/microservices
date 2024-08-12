import { FC, lazy, ReactElement, useCallback, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/store/store';
import { useCheckCurrentUserQuery } from './auth/services/auth.service';
import { IReduxState } from '~/store/store.interface';
import { applicationLogout, getDataFromLocalStorage, saveToSessionStorage } from '~shared/utils/utils.service';
import { addAuthUser } from './auth/reducers/auth.reducer';
import { useGetCurrentBuyerByEmailQuery } from './buyer/services/buyer.service';
import { addBuyer } from './buyer/reducers/buyer.reducer';
import { useGetSellerByEmailQuery } from './seller/services/seller.service';
import { addSeller } from './seller/reducers/seller.reducer';
import CircularPageLoader from '~shared/page-loader/CircularPageLoader';
import { socket } from '~/sockets/socket.service';
import Index from './index/Index';

// const Index = lazy(() => import('./index/Index'));
const HomeHeader = lazy(() => import('~shared/header/components/HomeHeader'));
const Home = lazy(() => import('./home/Home'));

const AppPage: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const appLogout = useAppSelector((state: IReduxState) => state.logout);
  const showCategoryContainer = useAppSelector((state: IReduxState) => state.showCategoryContainer);
  const [tokenIsValid, setTokenIsValid] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const { data: currentUserData, isError } = useCheckCurrentUserQuery(undefined, {
    // it will skip if the user is not logged in
    skip: authUser.id === null
  });
  const { data: buyerData, isLoading: isBuyerLoading } = useGetCurrentBuyerByEmailQuery(undefined, {
    skip: authUser.id === null
  });
  const { data: sellerData, isLoading: isSellerLoading } = useGetSellerByEmailQuery(`${authUser.email}`, {
    skip: authUser.id === null
  });

  const checkUser = useCallback(async () => {
    try {
      if (currentUserData && currentUserData.user && !appLogout) {
        setTokenIsValid(true);
        dispatch(addAuthUser({ authInfo: currentUserData.user }));
        dispatch(addBuyer(buyerData?.buyer));
        dispatch(addSeller(sellerData?.seller));
        saveToSessionStorage(JSON.stringify(true), JSON.stringify(authUser.email));
        const becomeASeller: boolean = getDataFromLocalStorage('becomeASeller');
        if (becomeASeller) {
          navigate('/seller_onboarding');
        }
        if (authUser.email !== null) {
          socket.emit('loggedInUsers', authUser.email);
        }
      }
    } catch (error) {
      console.log(error);
    }
    // put everything used in useCallback inside dependency
  }, [currentUserData, navigate, dispatch, appLogout, authUser.email, sellerData, buyerData]);

  const logoutUser = useCallback(async () => {
    if ((!currentUserData && appLogout) || isError) {
      setTokenIsValid(false);
      applicationLogout(dispatch, navigate);
    }
  }, [currentUserData, dispatch, navigate, appLogout, isError, buyerData, sellerData]);

  useEffect(() => {
    checkUser();
    logoutUser();
  }, [checkUser, logoutUser]);

  if (authUser) {
    return !tokenIsValid && !authUser.id ? (
      <Index />
    ) : (
      <>
        {isBuyerLoading && isSellerLoading ? (
          <CircularPageLoader />
        ) : (
          <>
            <HomeHeader showCategoryContainer={showCategoryContainer} />
            <Home />
          </>
        )}
      </>
    );
  } else {
    return <h1>hello</h1>;
  }
};

export default AppPage;
