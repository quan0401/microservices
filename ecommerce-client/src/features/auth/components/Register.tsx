import { ChangeEvent, FC, lazy, LazyExoticComponent, ReactElement, useEffect, useRef, useState } from 'react';
import { browserName, useMobileOrientation } from 'react-device-detect';
import { FaCamera, FaChevronLeft, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

import { IModalBgProps } from '~/shared/modals/interfaces/modal.interface';
import { IAlertProps, IButtonProps, IDropdownProps, IResponse } from '~/shared/shared.interface';
import { useAppDispatch } from '~/store/store';
import TextInput from '~shared/inputs/TextInput';
import ModalBg from '~shared/modals/ModalBg';
import { checkImageOrVideo, readAsBase64 } from '~shared/utils/image-utils.service';
import { countriesList, saveToSessionStorage } from '~shared/utils/utils.service';

import { useAuthScheme } from '../hooks/useAuthScheme';
import { ISignUpPayload } from '../interfaces/auth.interface';
import { addAuthUser } from '../reducers/auth.reducer';
import { updateLogout } from '../reducers/logout.reducer';
import { registerUserSchema } from '../schemes/auth.scheme';
import { useSignUpMutation } from '../services/auth.service';
import { updateCategoryContainer } from '~shared/header/reducers/category.reducer';
import { updateHeader } from '~shared/header/reducers/header.reducer';

const Button: LazyExoticComponent<FC<IButtonProps>> = lazy(() => import('~/shared/button/Button'));
const Alert: LazyExoticComponent<FC<IAlertProps>> = lazy(() => import('~/shared/alert/Alert'));
const Dropdown: LazyExoticComponent<FC<IDropdownProps>> = lazy(() => import('~shared/dropdown/Dropdown'));

const RegisterModal: FC<IModalBgProps> = ({ onClose, onToggle }): ReactElement => {
  const mobileOrientation = useMobileOrientation();
  const [step, setStep] = useState<number>(1);
  const [country, setCountry] = useState<string>('Select Country');
  const [passwordType, setPasswordType] = useState<string>('password');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('https://placehold.co/330x220?text=Profile+Image');
  const [showImageSelect, setShowImageSelect] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<ISignUpPayload>({
    // TODO: delete this later
    username: 'test',
    password: 'quan0401',
    email: 'test@gmail.com',
    country: 'country',
    profilePicture: '',
    browserName: browserName,
    deviceType: mobileOrientation.isLandscape ? 'browser' : 'mobile'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [schemaValidation] = useAuthScheme({ schema: registerUserSchema, userInfo });
  const [signup, { isLoading }] = useSignUpMutation();
  const dispatch = useAppDispatch();

  const handleFileChange = async (e: ChangeEvent): Promise<void> => {
    const target: HTMLInputElement = e.target as HTMLInputElement;
    if (target.files?.length) {
      const file: File = target.files[0];
      const isValid = checkImageOrVideo(file, 'image');
      if (isValid) {
        const dataImage: string | ArrayBuffer | null = await readAsBase64(file);
        setProfileImage(`${dataImage}`);
        setUserInfo({ ...userInfo, profilePicture: `${dataImage}` });
      }
      setShowImageSelect(false);
    }
  };

  const onRegisterUser = async (): Promise<void> => {
    try {
      const isValid: boolean = await schemaValidation();
      if (isValid) {
        // unwrap to provide raw resposne error too
        const result: IResponse = await signup(userInfo).unwrap();
        setAlertMessage('');
        dispatch(addAuthUser({ authInfo: result.user }));
        dispatch(updateLogout(false));
        dispatch(updateCategoryContainer(true));
        dispatch(updateHeader('home'));
        saveToSessionStorage(JSON.stringify(true), JSON.stringify(result.user?.email));
      }
    } catch (error) {
      setAlertMessage(error?.data.message);
    }
  };

  useEffect(() => {
    setProfileImage('https://placehold.co/330x220?text=Profile+Image');
    setShowImageSelect(false);
  }, [step]);

  return (
    <ModalBg>
      <div className="relative top-[10%] mx-auto w-11/12 max-w-md rounded bg-white md:w-2/3">
        <div className="relative px-5 py-5">
          <div className="flex justify-between text-2xl font-bold text-gray-600">
            {step > 1 && (
              <Button
                // className="cursor-pointer rounded text-gray-400 hover:text-gray-600"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer rounded text-gray-400 hover:text-gray-600"
                role="button"
                onClick={() => setStep(step - 1)}
                label={<FaChevronLeft className="icon icon-tabler icon-tabler-x" />}
              />
            )}
            <h4 className="text-center w-full">Join Ecommerce</h4>
            <Button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer rounded text-gray-400 hover:text-gray-600"
              role="button"
              onClick={onClose}
              label={<FaTimes className="icon icon-tabler icon-tabler-x" />}
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-center px-5 py-5">
          <ol className="flex w-full">
            <li className="flex w-full items-center text-white after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-sky-500 after:content-[''] dark:after:border-sky-500">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold dark:bg-sky-500 lg:h-12 lg:w-12">
                1
              </span>
            </li>
            <li className="flex items-center">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white lg:h-12 lg:w-12 ${
                  step === 2 ? 'bg-sky-500 dark:bg-sky-500' : 'bg-sky-300/50 dark:bg-sky-300/50'
                }`}
              >
                2
              </span>
            </li>
          </ol>
        </div>
        {alertMessage && (
          <div className="px-5">
            <Alert type="error" message={alertMessage} />
          </div>
        )}

        {step === 1 && (
          <div className="relative px-5 py-5">
            <div>
              <label htmlFor="username" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                Username
              </label>
              <TextInput
                id="username"
                name="username"
                type="text"
                value={userInfo.username}
                onChange={(e: ChangeEvent) =>
                  setUserInfo((prev: ISignUpPayload) => ({ ...prev, username: (e.target as HTMLInputElement).value }))
                }
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-sky-500/50 focus:outline-none"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                Email
              </label>
              <TextInput
                id="email"
                name="email"
                type="email"
                value={userInfo.email}
                onChange={(e: ChangeEvent) =>
                  setUserInfo((prev: ISignUpPayload) => ({ ...prev, email: (e.target as HTMLInputElement).value }))
                }
                className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-sky-500/50 focus:outline-none"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                Password
              </label>
              <div className="relative mb-5 mt-2">
                <div className="absolute right-0 flex h-full items-center pr-3 text-gray-600">
                  <div className="cursor-pointer">
                    {passwordType === 'password' ? (
                      <FaEyeSlash onClick={() => setPasswordType('text')} className="icon icon-tabler icon-tabler-info-circle" />
                    ) : (
                      <FaEye onClick={() => setPasswordType('password')} className="icon icon-tabler icon-tabler-info-circle" />
                    )}
                  </div>
                </div>
                <TextInput
                  id="password"
                  name="password"
                  type={passwordType}
                  value={userInfo.password}
                  onChange={(e: ChangeEvent) =>
                    setUserInfo((prev: ISignUpPayload) => ({ ...prev, password: (e.target as HTMLInputElement).value }))
                  }
                  className="flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-sky-500/50 focus:outline-none"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <Button
              disabled={!userInfo.username || !userInfo.email || !userInfo.password}
              onClick={() => setStep(2)}
              className={`text-md block w-full cursor-pointer rounded bg-sky-500 px-8 py-2 text-center font-bold text-white hover:bg-sky-400 focus:outline-none ${
                !userInfo.username || !userInfo.email || !userInfo.password ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              label="Continue"
            />
          </div>
        )}

        {step === 2 && (
          <div className="relative px-5 py-5">
            <div className="h-24">
              <label htmlFor="country" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                Country
              </label>
              <div id="country" className="relative mb-5 mt-2">
                <Dropdown
                  text={country}
                  maxHeight="200"
                  mainClassNames="absolute bg-white z-50"
                  showSearchInput={true}
                  placeholder="Type"
                  values={countriesList()}
                  setValue={setCountry}
                  onClick={(item: string) => {
                    setCountry(item);
                    setUserInfo({ ...userInfo, country: item });
                  }}
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="profilePicture" className="text-sm font-bold leading-tight tracking-normal text-gray-800">
                Profile Picture
              </label>
              <div
                onMouseEnter={() => setShowImageSelect(true)}
                onMouseLeave={() => setShowImageSelect(false)}
                className="relative mb-5 mt-2 w-[20%] cursor-pointer"
              >
                {profileImage && (
                  <img
                    id="profilePicture"
                    src={profileImage}
                    alt="Profile Picture"
                    className="left-0 top-0 h-20 w-20 rounded-full bg-white object-cover"
                  />
                )}
                {!profileImage && (
                  <div className="left-0 top-0 flex h-20 w-20 cursor-pointer justify-center rounded-full bg-[#dee1e7]"></div>
                )}
                {showImageSelect && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute left-0 top-0 flex h-20 w-20 cursor-pointer justify-center rounded-full bg-[#dee1e7]"
                  >
                    <FaCamera className="flex self-center" />
                  </div>
                )}
                <TextInput
                  name="image"
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <Button
              disabled={!userInfo.country || !profileImage}
              onClick={onRegisterUser}
              className={`text-md block w-full cursor-pointer rounded bg-sky-500 px-8 py-2 text-center font-bold text-white hover:bg-sky-400 focus:outline-none ${
                !userInfo.country || !userInfo.profilePicture ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              label={isLoading ? 'SIGNUP IN PROGRESS...' : 'SIGNUP'}
            />
          </div>
        )}

        <hr />
        <div className="px-5 py-4">
          <div className="ml-2 flex w-full justify-center text-sm font-medium">
            <div className="flex justify-center">
              Already a memeber?{' '}
              <p
                onClick={() => {
                  if (onToggle) {
                    onToggle(true);
                  }
                }}
                className="ml-2 flex cursor-pointer text-blue-600 hover:underline"
              >
                Sign In
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalBg>
  );
};

export default RegisterModal;
