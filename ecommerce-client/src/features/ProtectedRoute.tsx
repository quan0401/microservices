import { FC, ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/store/store';
import { IReduxState } from '~/store/store.interface';
import { useCheckCurrentUserQuery } from './auth/services/auth.service';
import { addAuthUser } from './auth/reducers/auth.reducer';
import { applicationLogout, saveToSessionStorage } from '~shared/utils/utils.service';
import { Navigate, NavigateFunction, useNavigate } from 'react-router-dom';
import HomeHeader from '~shared/header/components/HomeHeader';

export interface IProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<IProtectedRouteProps> = ({ children }): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const showCategoryContainer = useAppSelector((state: IReduxState) => state.showCategoryContainer);
  const header = useAppSelector((state: IReduxState) => state.header);
  const [tokenIsValid, setTokenIsValid] = useState<boolean>(false);
  const { data, isError } = useCheckCurrentUserQuery();
  const navigate: NavigateFunction = useNavigate();

  const dispatch = useAppDispatch();

  const checkUser = useCallback(async () => {
    if (data && data.user) {
      setTokenIsValid(true);
      dispatch(addAuthUser({ authInfo: data.user }));
      saveToSessionStorage(JSON.stringify(true), `${data.user.email}`);
    }

    if (isError) {
      setTokenIsValid(false);
      applicationLogout(dispatch, navigate);
    }
  }, [data, dispatch, navigate, isError, authUser.id]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if ((data && data.user) || authUser) {
    if (tokenIsValid) {
      return (
        <>
          {header && header === 'home' && <HomeHeader showCategoryContainer={showCategoryContainer} />}
          {children}
        </>
      );
    } else {
      return <></>;
    }
  } else {
    return <>{<Navigate to="/" />}</>;
  }
};

export default ProtectedRoute;
