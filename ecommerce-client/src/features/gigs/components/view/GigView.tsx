import { FC, ReactElement, useRef } from 'react';
import { useParams } from 'react-router-dom';
import StickyBox from 'react-sticky-box';
import { GigContext } from '~features/gigs/context/GigContext';
import { ISellerGig } from '~features/gigs/interfaces/gig.interface';
import { useGetGigByIdQuery, useGetMoreGigsLikeThisQuery } from '~features/gigs/services/gigs.service';
import { ISellerDocument } from '~features/seller/interfaces/seller.interface';
import CircularPageLoader from '~shared/page-loader/CircularPageLoader';
import StarRating from '~shared/rating/StarRating';
import { emptySellerData, emptyGigData } from '~shared/utils/static-data';
import { rating, shortenLargeNumbers } from '~shared/utils/utils.service';
import GigViewRight from './components/GigViewRight';
import { useGetSellerByIdQuery } from '~features/seller/services/seller.service';
import GigViewLeft from './components/GigViewLeft';
import TopGigsView from '~shared/gigs/TopGigsView';

const GigView: FC = (): ReactElement => {
  const { gigId, sellerId } = useParams();
  const { data: gigData, isSuccess: isGigDataSuccess, isLoading: isGigLoading } = useGetGigByIdQuery(`${gigId}`);
  const { data: sellerData, isSuccess: isSellerDataSuccess, isLoading: isSellerLoading } = useGetSellerByIdQuery(`${sellerId}`);
  const { data: moreGigsData, isSuccess: isMoreGigsSuccess, isLoading: isMoreGigsLoading } = useGetMoreGigsLikeThisQuery(`${gigId}`);
  const gig = useRef<ISellerGig>(emptyGigData);
  const moreGigs = useRef<ISellerGig[]>([]);
  const seller = useRef<ISellerDocument>(emptySellerData);

  const isLoading: boolean = isGigLoading && isSellerLoading && isMoreGigsLoading;

  if (isGigDataSuccess) {
    gig.current = gigData.gig as ISellerGig;
  }
  if (isSellerDataSuccess) {
    seller.current = sellerData.seller as ISellerDocument;
  }
  if (isMoreGigsSuccess) {
    moreGigs.current = moreGigsData.gigs as ISellerGig[];
  }

  return (
    <>
      {isLoading ? (
        <CircularPageLoader />
      ) : (
        <>
          <main className="max-w-8xl container mx-auto mt-8">
            <h2 className="mb-4 px-4 text-xl font-bold text-[#404145] lg:text-3xl">{gig.current.title}</h2>
            <div className="mb-4 flex flex-row gap-x-2 px-4">
              <img className="flex h-8 w-8 self-center rounded-full object-cover" src={gig.current.profilePicture} alt="" />
              <span className="flex self-center font-extrabold">{gig.current.username}</span>
              <>
                {gig.current.ratingSum && gig.current.ratingsCount && gig.current.ratingSum >= 1 && gig.current.ratingsCount >= 1 ? (
                  <>
                    <span className="flex self-center">|</span>

                    <div className="flex w-full gap-x-1 self-center">
                      <div className="mt-1 w-20 gap-x-2">
                        <StarRating value={rating(gig.current.ratingSum / gig.current.ratingsCount)} size={14} />
                      </div>
                      <div className="ml-2 mt-[1px] flex gap-1 text-sm">
                        <span className="text-orange-400">{rating(gig.current.ratingSum / gig.current.ratingsCount)}</span>
                        <span className="">({shortenLargeNumbers(gig.current.ratingsCount)})</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            </div>
            <GigContext.Provider value={{ gig: gig.current, seller: seller.current, isSuccess: isGigDataSuccess, isLoading: isGigLoading }}>
              <div className="flex flex-wrap">
                <div className="order-last w-full p-4 lg:order-first lg:w-2/3">
                  <GigViewLeft />
                </div>

                <div className="w-full p-4 lg:w-1/3">
                  <StickyBox offsetTop={10} offsetBottom={10}>
                    <GigViewRight />
                  </StickyBox>
                </div>
              </div>
            </GigContext.Provider>
            {moreGigs.current?.length > 0 ? (
              <div className="m-auto px-6 xl:container md:px-12 lg:px-6">
                <TopGigsView gigs={moreGigs.current} title="Recommended for you" subTitle="" width="w-60" type="home" />
              </div>
            ) : (
              <></>
            )}
          </main>
        </>
      )}
    </>
  );
};

export default GigView;
