import { FC, ReactElement, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/store/store';
import { IReduxState } from '~/store/store.interface';
import { ISellerDocument } from '~features/seller/interfaces/seller.interface';
import Breadcrumb from '~shared/breadcrumb/Breadcrumb';
import Button from '~shared/button/Button';
import ProfileHeader from './components/ProfileHeader';
import isEqual from 'react-fast-compare';
import { addSeller } from '~features/seller/reducers/seller.reducer';
import ProfileTabs from './components/ProfileTabs';
import SellerOverview from './components/SellerOverview';
import { useParams } from 'react-router-dom';
import { IResponse } from '~shared/shared.interface';
import { useUpdateSellerMutation } from '~features/seller/services/seller.service';
import { showErrorToast, showSuccessToast } from '~shared/utils/utils.service';
import CircularPageLoader from '~shared/page-loader/CircularPageLoader';
import { useGetGigsBySellerIdQuery } from '~features/gigs/services/gigs.service';
import { ISellerGig } from '~features/gigs/interfaces/gig.interface';
import GigCardDisplayItem from '~shared/gigs/GigCardDisplayItem';
import { v4 as uuidv4 } from 'uuid';
import { useGetReviewsByGigIdQuery } from '~features/order/services/review.service';
import { IReviewDocument } from '~features/order/interfaces/review.interface';
import GigViewReviews from '~features/gigs/components/view/components/GigViewLeft/GigViewReviews';

const CurrentSellerProfile: FC = (): ReactElement => {
  const seller: ISellerDocument = useAppSelector((state: IReduxState) => state.seller);
  const dispatch = useAppDispatch();
  const [sellerProfile, setSellerProfile] = useState<ISellerDocument>(seller);
  const [showEditIcons, setShowEditIcons] = useState<boolean>(true);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [type, setType] = useState<string>('Overview');
  const { sellerId } = useParams();
  const { data, isSuccess: isSellerGigSuccess, isLoading: isSellerGigLoading } = useGetGigsBySellerIdQuery(`${sellerId}`);
  const {
    data: sellerData,
    isSuccess: isGigReviewSuccess,
    isLoading: isGigReviewLoading
  } = useGetReviewsByGigIdQuery(`${sellerId}`, { skip: true });
  let reviews: IReviewDocument[] = [];

  if (isGigReviewSuccess) {
    reviews = sellerData.reviews as IReviewDocument[];
  }
  const [updateSeller, { isLoading }] = useUpdateSellerMutation();
  const isDataLoading: boolean = isSellerGigLoading && isGigReviewLoading && !isSellerGigSuccess && !isGigReviewSuccess;

  const onHandleUpdateSeller = async (): Promise<void> => {
    try {
      const response: IResponse = await updateSeller({ sellerId: `${sellerId}`, seller: sellerProfile }).unwrap();
      dispatch(addSeller(response.seller));
      setSellerProfile(response.seller as ISellerDocument);
      showSuccessToast('Seller profile updated successfully');
    } catch (error) {
      showErrorToast('Error updating profile');
    }
  };

  const handleCancelAllChanges = () => {
    setSellerProfile({ ...seller });
    setShowButtons(false);
  };

  useEffect(() => {
    const result = isEqual(seller, sellerProfile);

    if (!result) {
      setShowButtons(true);
    } else {
      setShowButtons(false);
    }
  }, [sellerProfile]);

  return (
    <div className="relative w-full pb-6">
      <Breadcrumb breadCrumbItems={['Seller', `${seller.username}`]} />

      {isLoading || isDataLoading ? (
        <CircularPageLoader />
      ) : (
        <div className="container mx-auto px-2 md:px-1">
          <div className="my-2 flex h-8 justify-end md:h-10">
            {showButtons && (
              <div>
                <Button
                  className="md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-2"
                  label="Save all changes"
                  onClick={onHandleUpdateSeller}
                />
                &nbsp;&nbsp;
                <Button
                  className="md:text-md rounded bg-red-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-red-500 focus:outline-none md:py-2"
                  label="Cancel all changes"
                  onClick={handleCancelAllChanges}
                />
              </div>
            )}
          </div>
          <ProfileHeader showEditIcons={showEditIcons} showHeaderInfo sellerProfile={sellerProfile} setSellerProfile={setSellerProfile} />
          <div className="my-4 cursor-pointer">
            <ProfileTabs type={type} setType={setType} />
          </div>

          <div className="flex flex-wrap bg-white p-5">
            {type === 'Overview' && (
              <SellerOverview sellerProfile={sellerProfile} setSellerProfile={setSellerProfile} showEditIcons={showEditIcons} />
            )}
            {type === 'Active' && (
              <div className="grid gap-x-6 pt-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data?.gigs &&
                  data.gigs.map((gig: ISellerGig) => (
                    <GigCardDisplayItem key={uuidv4()} gig={gig} linkTarget={false} showEditIcon={true} />
                  ))}
              </div>
            )}
            {type === 'Ratings & Reviews' && (
              <GigViewReviews showRatings={false} reviews={reviews} hasFetchedReviews={true} type="ofSeller" />
            )}
          </div>
          <div className="flex flex-wrap bg-white"></div>
        </div>
      )}
    </div>
  );
};

export default CurrentSellerProfile;
