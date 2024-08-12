import { FC, ReactElement, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { GigContext } from '~features/gigs/context/GigContext';
import { IGigViewReviewsProps } from '~features/gigs/interfaces/gig.interface';
import { IRatingCategories, IRatingCategoryItem, IReviewDocument } from '~features/order/interfaces/review.interface';
import { useGetReviewsByGigIdQuery, useGetReviewsBySellerIdQuery } from '~features/order/services/review.service';
import StarRating from '~shared/rating/StarRating';
import { ratingTypes } from '~shared/utils/static-data';
import { TimeAgo } from '~shared/utils/timeago.utils';
import { rating, shortenLargeNumbers } from '~shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const GigViewReviews: FC<IGigViewReviewsProps> = ({ showRatings, reviews, hasFetchedReviews, type }): ReactElement => {
  const { gigId, sellerId } = useParams<string>();
  const { gig } = useContext(GigContext);
  const { data, isSuccess } = useGetReviewsByGigIdQuery(`${gigId}`, { skip: type !== 'ofGig' });
  const { data: sellerReviews, isSuccess: isSellerReviewsSuccesss } = useGetReviewsBySellerIdQuery(`${sellerId}`, {
    skip: type !== 'ofSeller'
  });
  if (isSuccess && !hasFetchedReviews && data.reviews?.length) {
    reviews = data.reviews as IReviewDocument[];
  } else if (isSellerReviewsSuccesss && !hasFetchedReviews && sellerReviews.reviews) {
    reviews = sellerReviews.reviews as IReviewDocument[];
  }

  const percentage = (partialValue: number, totalValue: number): number => {
    return (100 * partialValue) / totalValue;
  };

  return (
    <>
      {showRatings && gig && (
        <>
          <div className="mb-10">
            <h2 className="mb-4 text-lg font-bold">Reviews</h2>
            <div className="flex flex-col gap-y-3 pt-2 lg:flex-row lg:gap-x-6">
              <div className="w-full">
                {Object.entries(gig?.ratingCategories as IRatingCategories).map((rating: [string, IRatingCategoryItem]) => (
                  <div key={uuidv4()} className="mb-8 flex flex-col gap-y-2 lg:flex-row lg:gap-x-2">
                    <div className="w-full truncate text-sm lg:w-1/12">
                      {ratingTypes[`${rating[0]}`]} Star{rating[0] === 'one' ? '' : 's'}
                    </div>
                    <div className="flex h-2.5 w-full self-center rounded-full bg-slate-200 lg:w-full">
                      <div
                        className="h-2.5 rounded-full bg-orange-400"
                        style={{ width: `${percentage(rating[1].value, parseInt(`${gig?.ratingSum}`))}%` }}
                      ></div>
                    </div>
                    <div className="w-full text-start text-sm lg:w-1/12 lg:text-end">({shortenLargeNumbers(rating[1].count)})</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr className="border-grey my-3" />
        </>
      )}

      <div className="flex flex-col gap-6">
        {reviews &&
          reviews.map((item: IReviewDocument) => (
            <div key={uuidv4()}>
              <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-4">
                <img
                  className="flex self-center h-12 w-12 mt-4 rounded-full object-cover md:self-auto"
                  src={item.reviewerImage}
                  alt="Reviewer Image"
                />
                <div className="flex flex-col self-center">
                  <div className="flex cursor-pointer self-center pt-0 no-underline md:block md:self-start md:pt-4">
                    <span className="text-base font-bold md:mb-5">{item.reviewerUsername}</span>
                  </div>
                  <span className="flex self-center text-sm md:block md:self-start">{item.country}</span>
                  <div className="flex w-full gap-x-1 self-center justify-center md:justify-start">
                    <div className="mt-1 w-20 gap-x-2">
                      <StarRating value={rating(item.rating)} size={14} />
                    </div>
                    <div className="ml-2 mt-[1px] flex gap-1 text-sm">
                      <span className="text-orange-400">{rating(item.rating)}</span>|
                      <span>{TimeAgo.chatMessageTransform(`${item.createdAt}`)}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-center md:text-base md:text-left">{item.review}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default GigViewReviews;
