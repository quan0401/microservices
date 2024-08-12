import { ChangeEvent, FC, lazy, LazyExoticComponent, ReactElement, useState, KeyboardEvent } from 'react';
import { browserName, useMobileOrientation } from 'react-device-detect';
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { IModalBgProps } from '~/shared/modals/interfaces/modal.interface';
import ModalBg from '~/shared/modals/ModalBg';
import { IAlertProps, IButtonProps, IResponse } from '~/shared/shared.interface';
import { useAppDispatch } from '~/store/store';
import { ISignInPayload } from '~features/auth/interfaces/auth.interface';
import TextInput from '~shared/inputs/TextInput';
import { saveToSessionStorage } from '~shared/utils/utils.service';

import { useAuthScheme } from '../hooks/useAuthScheme';
import { addAuthUser } from '../reducers/auth.reducer';
import { updateLogout } from '../reducers/logout.reducer';
import { loginUserSchema } from '../schemes/auth.scheme';
import { useSignInMutation } from '../services/auth.service';
import { updateHeader } from '~shared/header/reducers/header.reducer';
import { updateCategoryContainer } from '~shared/header/reducers/category.reducer';

const Button: LazyExoticComponent<FC<IButtonProps>> = lazy(() => import('~/shared/button/Button'));
const Alert: LazyExoticComponent<FC<IAlertProps>> = lazy(() => import('~/shared/alert/Alert'));

const LoginModal: FC<IModalBgProps> = ({ onClose, onToggle, onTogglePassword }): ReactElement => {
  const mobileOrientation = useMobileOrientation();
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [passwordType, setPasswordType] = useState<'password' | 'text'>('password');
  const [userInfo, setUserInfo] = useState<ISignInPayload>({
    // TODO: delete later
    email: 'dongminhquan2004@gmail.com',
    password: 'fresh0401',
    browserName,
    deviceType: mobileOrientation.isLandscape ? 'browser' : 'mobile'
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [schemaValidation, validationErrors] = useAuthScheme({ schema: loginUserSchema, userInfo });
  const [signin, { isLoading }] = useSignInMutation();

  const onLoginUser = async (): Promise<void> => {
    try {
      const isValid: boolean = await schemaValidation();
      if (isValid) {
        // unwrap to resolve error
        const result: IResponse = await signin(userInfo).unwrap();
        // TODO: add opt feature later
        // if (result && (result.browserName || result.deviceType)) {
        //   navigate('/verify_otp');
        // } else {
        setAlertMessage('successful');
        dispatch(addAuthUser({ authInfo: result.user }));
        dispatch(updateLogout(false));
        dispatch(updateCategoryContainer(true));
        dispatch(updateHeader('home'));
        saveToSessionStorage(JSON.stringify(true), JSON.stringify(result.user?.email));
        // }
      }
    } catch (error) {
      setAlertMessage(error?.data.message);
    }
  };

  return (
    <ModalBg>
      <div className="relative top-[20%] mx-auto w-11/12 max-w-md rounded-lg bg-white md:w-2/3">
        <div className="relative px-5 py-5">
          <div className="mb-5 flex justify-between items-center text-2xl font-bold text-gray-600">
            <h2 className="flex w-full justify-center">Sign In to Ecommerce</h2>
            <Button
              testId="closeModal"
              className="cursor-pointer rounded text-gray-400 hover:text-gray"
              role="button"
              label={<FaTimes className="icon icon-tabler icon-tabler-x" />}
              onClick={onClose}
            />
          </div>
          {alertMessage && <Alert type="error" message={alertMessage} />}
          <div>
            <label htmlFor="email or username" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
              Email
            </label>
            <TextInput
              id="username"
              name="username"
              type="text"
              value={userInfo.email}
              className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-sky-500/50 focus:outline-none"
              placeholder="Enter email"
              onChange={(e: ChangeEvent) => setUserInfo((prev) => ({ ...prev, email: (e.target as HTMLInputElement).value }))}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
              Password
            </label>
            <div className="relative mb-2 mt-2">
              <div className="absolute right-0 flex h-full items-center pr-3 text-gray-600">
                <div className="cursor-pointer">
                  {passwordType === 'password' ? (
                    <FaEye onClick={() => setPasswordType('text')} />
                  ) : (
                    <FaEyeSlash onClick={() => setPasswordType('password')} />
                  )}
                </div>
              </div>
              <TextInput
                id="password"
                name="password"
                type={passwordType}
                value={userInfo.password}
                className="flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-sky-500/50 focus:outline-none"
                placeholder="Enter password"
                onKeyDown={async (e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    await onLoginUser();
                  }
                }}
                onChange={(e: ChangeEvent) => {
                  setUserInfo((prev) => ({ ...prev, password: (e.target as HTMLInputElement).value }));
                }}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <div
              onClick={() => {
                if (onTogglePassword) {
                  onTogglePassword(true);
                }
              }}
              className="mb-6 ml-2 cursor-pointer text-sm text-blue-600 hover:underline dark:text-blue-500"
            >
              Forgot Password?
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <Button
              testId="submit"
              disabled={false}
              className="text-md block w-full cursor-pointer rounded bg-sky-500 px-8 py-2 text-center font-bold text-white hover:bg-sky-400 focus:outline-none"
              label={isLoading ? 'Login in progress' : 'LOGIN'}
              onClick={onLoginUser}
            />
          </div>
        </div>
        <hr />
        <div className="px-5 py-4">
          <div className="ml-2 flex w-full justify-center text-sm font-medium">
            <div className="flex justify-center">
              Not yet a memeber?{' '}
              <p
                onClick={() => {
                  if (onToggle) {
                    onToggle(true);
                  }
                }}
                className="ml-2 flex cursor-pointer text-blue-600 hover:underline"
              >
                Join Now
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default LoginModal;
