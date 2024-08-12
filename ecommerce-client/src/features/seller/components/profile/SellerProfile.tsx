import { FC, lazy, ReactElement, useState } from 'react';
import Breadcrumb from '~shared/breadcrumb/Breadcrumb';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import { useParams } from 'react-router-dom';
import { useGetSellerByIdQuery } from '~features/seller/services/seller.service';
import CircularPageLoader from '~shared/page-loader/CircularPageLoader';
import { ISellerGig } from '~features/gigs/interfaces/gig.interface';
import { useGetGigsBySellerIdQuery } from '~features/gigs/services/gigs.service';
import { v4 as uuidv4 } from 'uuid';
import { IReviewDocument } from '~features/order/interfaces/review.interface';
import { useGetReviewsBySellerIdQuery } from '~features/order/services/review.service';
import GigViewReviews from '~features/gigs/components/view/components/GigViewLeft/GigViewReviews';

const SellerOverview = lazy(() => import('./components/SellerOverview'));
const GigCardDisplayItem = lazy(() => import('~shared/gigs/GigCardDisplayItem'));

const SellerProfile: FC = (): ReactElement => {
  const [showEditIcons, setShowEditIcons] = useState<boolean>(false);
  const [type, setType] = useState<string>('Overview');
  const { sellerId } = useParams();
  const { data: sellerData, isLoading: isSellerLoading, isSuccess: isSellerSuccess } = useGetSellerByIdQuery(`${sellerId}`);
  const { data: gigData, isSuccess: isSellerGigSuccess, isLoading: isSellerGigLoading } = useGetGigsBySellerIdQuery(`${sellerId}`);
  const {
    data: sellerReviewsData,
    isSuccess: isGigReviewSuccess,
    isLoading: isGigReviewLoading
  } = useGetReviewsBySellerIdQuery(`${sellerId}`);
  let reviews: IReviewDocument[] = [];
  if (isGigReviewSuccess) {
    reviews = sellerReviewsData.reviews as IReviewDocument[];
  }

  const isLoading: boolean =
    isSellerGigLoading && isSellerLoading && isGigReviewLoading && !isSellerSuccess && !isSellerGigSuccess && !isGigReviewSuccess;

  if (sellerData) {
    // console.log('first', sellerData.seller?.experience[0]);
  }

  return (
    <div className="relative w-full pb-6">
      <Breadcrumb breadCrumbItems={['Seller', `${sellerData && sellerData.seller ? sellerData.seller.username : ''}`]} />

      {isLoading ? (
        <CircularPageLoader />
      ) : (
        <div className="container mx-auto px-2 md:px-1">
          {/* <div className="my-2 flex h-8 justify-end md:h-10"></div> */}
          <ProfileHeader showEditIcons={showEditIcons} showHeaderInfo sellerProfile={sellerData?.seller} />
          <div className="my-4 cursor-pointer">
            <ProfileTabs type={type} setType={setType} />
          </div>

          <div className=" flex flex-wrap bg-white p-5">
            {type === 'Overview' && <SellerOverview sellerProfile={sellerData?.seller} showEditIcons={showEditIcons} />}
            {type === 'Active' && (
              <div className="grid gap-x-6 pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {gigData?.gigs &&
                  gigData.gigs.map((gig: ISellerGig) => (
                    <GigCardDisplayItem key={uuidv4()} gig={gig} linkTarget={false} showEditIcon={false} />
                  ))}
              </div>
            )}
            {type === 'Ratings & Reviews' && (
              <GigViewReviews showRatings={false} reviews={reviews} hasFetchedReviews={false} type="ofSeller" />
            )}
          </div>

          <div className="flex flex-wrap bg-white"></div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
