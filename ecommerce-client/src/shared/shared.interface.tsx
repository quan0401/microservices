import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ChangeEvent, CSSProperties, Dispatch, KeyboardEvent, ReactNode, Ref, SetStateAction } from 'react';

import { IAuthDocument, IAuthResponse, IResetPassword, ISignInPayload, ISignUpPayload } from '~features/auth/interfaces/auth.interface';
import { IBuyerDocument } from '~features/buyer/interfaces/buyer.interface';
import { IConversationDocument, IMessageDocument } from '~features/chat/interfaces/chat.interface';
import { ICreateGig, ISellerGig } from '~features/gigs/interfaces/gig.interface';
import { IOrderDocument, IOrderNotifcation } from '~features/order/interfaces/order.interface';
import { IReviewDocument } from '~features/order/interfaces/review.interface';
import { IEducation, IExperience, ILanguage, IPersonalInfoData, ISellerDocument } from '~features/seller/interfaces/seller.interface';

export type validationErrorsType =
  | ISignInPayload
  | ISignUpPayload
  | IResetPassword
  | ICreateGig
  | IPersonalInfoData
  | IExperience
  | IEducation
  | ILanguage;

export interface IQueryResponse {
  data: IAuthResponse;
  error: FetchBaseQueryError | SerializedError;
}

export interface IResponse {
  message?: string;
  token?: string;
  user?: IAuthDocument;
  buyer?: IBuyerDocument;
  seller?: ISellerDocument;
  sellers?: ISellerDocument[];
  gig?: ISellerGig;
  gigs?: ISellerGig[];
  sort?: number[];
  total?: number;
  sortItems?: string[];
  conversations?: IConversationDocument[] | IMessageDocument[];
  messages?: IMessageDocument[];
  messageData?: IMessageDocument;
  conversationId?: string;
  clientSecret?: string;
  paymentIntentId?: string;
  order?: IOrderDocument;
  orders?: IOrderDocument[];
  review?: IReviewDocument;
  reviews?: IReviewDocument[];
  notifications?: IOrderNotifcation[];
  browserName?: string;
  deviceType?: string;
}

export interface IBannerProps {
  bgColor: string;
  text: string;
  showLink: boolean;
  linkText?: string;
  onClick?: () => void;
}

export interface IAlertProps {
  type: string;
  message: string;
}

export interface IAlertTypes {
  [key: string]: string;
  success: string;
  error: string;
  warning: string;
}

export interface IBreadCrumbProps {
  breadCrumbItems: string[];
}

export interface IDropdownProps {
  text: string;
  values: string[];
  maxHeight: string;
  placeholder?: string;
  mainClassNames?: string;
  dropdownClassNames?: string;
  showSearchInput?: boolean;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  setValue?: Dispatch<SetStateAction<string>>;
  onClick?: (item: string) => void;
  onFocus?: () => void;
}

export interface IHtmlParserProps {
  input: string;
}

export interface IPageMessageProps {
  header: string;
  body: string;
}

export interface ITextInputProps {
  id?: string;
  name?: string;
  type?: string;
  value?: string | number;
  ref?: Ref<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  readOnly?: boolean;
  checked?: boolean;
  rows?: number;
  autoFocus?: boolean;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  onChange?: (event: ChangeEvent) => void;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyUp?: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
}

export interface IButtonProps {
  label?: string | ReactNode;
  type?: 'button' | 'submit' | 'reset' | undefined;
  id?: string;
  className?: string;
  role?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (event?: any) => void;
  disabled?: boolean;
  testId?: string;
}

export interface ISliderImagesText {
  header: string;
  subHeader: string;
}

export interface IStarRatingProps {
  value?: number;
  size?: number;
  setReviewRating?: Dispatch<SetStateAction<number>>;
}

export interface IGigCardItemModal {
  overlay: boolean;
  deleteApproval: boolean;
}

export interface IPaginateProps {
  from: string;
  size: number;
  type: string;
}
