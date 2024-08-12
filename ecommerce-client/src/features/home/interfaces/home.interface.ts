import { ISellerGig } from '~features/gigs/interfaces/gig.interface';
import { ISellerDocument } from '~features/seller/interfaces/seller.interface';

export interface IHomeProps {
  gigs: ISellerGig[];
  title: string;
  subTitle?: string;
  category?: string;
}

export interface ISliderState {
  slideShow: string;
  slideIndex: number;
}

export interface IFeaturedExpertProps {
  sellers: ISellerDocument[];
}

export interface ICategory {
  name: string;
  icon: string;
}
