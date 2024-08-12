import { FC, ReactElement, useContext, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaRegStar } from 'react-icons/fa';
import { OrderContext } from '~features/order/context/OrderContext';
import { IOrderReviewModal } from '~features/order/interfaces/order.interface';
import Button from '~shared/button/Button';
import ReviewModal from '~shared/modals/ReviewModal';
import StarRating from '~shared/rating/StarRating';
import { TimeAgo } from '~shared/utils/timeago.utils';

const OrderReview: FC = (): ReactElement => {
  const { order, authUser } = useContext(OrderContext);
  const [orderReviewModal, setOrderReviewModal] = useState<IOrderReviewModal>({
    buyerReview: false,
    sellerReview: false,
    buyerPanel: false,
    sellerPanel: false
  });

  return (
    <>
      {orderReviewModal.buyerReview && (
        <ReviewModal type="buyer-review" order={order} onClose={() => setOrderReviewModal({ ...orderReviewModal, buyerReview: false })} />
      )}
      {orderReviewModal.sellerReview && (
        <ReviewModal type="seller-review" order={order} onClose={() => setOrderReviewModal({ ...orderReviewModal, sellerReview: false })} />
      )}
      {order?.approved && authUser?.email === order.buyerEmail && order.buyerReview?.rating === 0 && (
        <div className="flex rounded-[4px] bg-white px-4 py-3">
          <div className="w-full">
            <div className="flex gap-4">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eb8c34]">
                  <FaRegStar size={18} color="#fcd5b1" />
                </div>
              </div>
              <div className="w-full cursor-pointer pb-6">
                <div className="mt-2 flex items-center justify-between font-medium text-gray-500">
                  <span>Ready to review the seller?</span>
                </div>
                <div className="my-3 flex">
                  <Button
                    onClick={() => setOrderReviewModal({ ...orderReviewModal, buyerReview: true })}
                    className="rounded bg-green-500 px-6 py-3 text-center text-sm font-bold text-white hover:bg-green-400 focus:outline-none md:px-4 md:py-2 md:text-base"
                    label="Leave a Review"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {order?.approved && order?.buyerReview && order?.buyerReview?.rating > 0 && (
        <div
          className="flex rounded-[4px] bg-white px-4 py-3"
          onClick={() => setOrderReviewModal({ ...orderReviewModal, buyerPanel: !orderReviewModal.buyerPanel })}
        >
          <div className="w-full">
            <div className="flex gap-4">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ededed]">
                  <FaRegStar size={18} color="#6d6d6e" />
                </div>
              </div>
              <div className="border-grey w-full cursor-pointer border-b pb-6">
                <div className="mt-2 flex items-center justify-between font-medium text-gray-500">
                  <div className="flex gap-2">
                    {authUser?.email === order.buyerEmail && <span>You left a {order.buyerReview?.rating}-star review</span>}
                    {authUser?.email === order.sellerEmail && (
                      <span>
                        {order.buyerEmail} gave you a {order.buyerReview?.rating}-star review
                      </span>
                    )}
                    <p className="flex self-center text-sm font-normal italic">{TimeAgo.dayWithTime(`${order?.events.buyerReview}`)}</p>
                  </div>
                  <div>{!orderReviewModal.buyerPanel ? <FaChevronDown size={15} /> : <FaChevronUp size={15} />}</div>
                </div>
                {orderReviewModal.buyerPanel && (
                  <div className="my-3 flex flex-col">
                    <div className="relative overflow-x-auto">
                      <div className="border-grey w-full rounded border text-left text-sm text-gray-500">
                        <div className="border-grey border-b bg-[#fafafb] py-3 font-medium uppercase">
                          <span className="px-5">
                            {authUser?.email === order.buyerEmail ? 'Your Review' : `${order.buyerEmail}'s Review`}
                          </span>
                        </div>
                        <div className="flex w-full cursor-pointer flex-col items-center space-x-4 px-5 py-4 md:flex-row">
                          <div className="flex w-full justify-center md:w-12 md:self-start">
                            <img className="h-10 w-10 rounded-full object-cover" src={order.buyerImage} alt="Buyer Image" />
                          </div>
                          <div className="w-full text-sm dark:text-white">
                            <div className="flex justify-between text-sm font-bold text-[#777d74] md:text-base">
                              <div className="flex flex-row gap-2">
                                {authUser?.email === order.buyerEmail ? 'Me' : order.buyerEmail}
                                <div className="flex self-center">
                                  <div className="flex  items-center gap-x-1">
                                    <StarRating value={order.buyerReview?.rating} size={14} />
                                  </div>
                                  <div className="ml-1 flex gap-1 text-sm">
                                    <span className="text-orange-400">({order.buyerReview?.rating})</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-1 flex flex-col justify-between text-[#777d74]">
                              <span className="text-sm md:text-[15px]">{order.buyerReview?.review}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {order?.approved &&
        authUser?.email === order.sellerEmail &&
        order?.sellerReview?.rating === 0 &&
        order?.buyerReview &&
        order?.buyerReview?.rating > 0 && (
          <div
            className="flex rounded-[4px] bg-white px-4 py-3"
            onClick={() => setOrderReviewModal({ ...orderReviewModal, sellerReview: true })}
          >
            <div className="w-full">
              <div className="flex gap-4">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eb8c34]">
                    <FaRegStar size={18} color="#fcd5b1" />
                  </div>
                </div>
                <div className="w-full cursor-pointer pb-6">
                  <div className="mt-2 flex items-center justify-between font-medium text-gray-500">
                    <span>Ready to review the buyer?</span>
                  </div>
                  <div className="my-3 flex">
                    <Button
                      className="rounded bg-green-500 px-6 py-3 text-center text-sm font-bold text-white hover:bg-green-400 focus:outline-none md:px-4 md:py-2 md:text-base"
                      label="Leave a Review"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {order?.approved && order?.sellerReview && order?.sellerReview?.rating > 0 && (
        <div
          className="flex rounded-[4px] bg-white px-4 py-3"
          onClick={() => setOrderReviewModal({ ...orderReviewModal, sellerPanel: !orderReviewModal.sellerPanel })}
        >
          <div className="w-full">
            <div className="flex gap-4">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ededed]">
                  <FaRegStar size={18} color="#6d6d6e" />
                </div>
              </div>
              <div className="w-full cursor-pointer pb-6">
                <div className="mt-2 flex items-center justify-between font-medium text-gray-500">
                  <div className="flex gap-2">
                    {authUser?.email === order.sellerEmail && (
                      <span>
                        You left {order.buyerEmail} a {order.sellerReview?.rating}-star review
                      </span>
                    )}
                    {authUser?.email === order.buyerEmail && (
                      <span>
                        {order.sellerEmail} gave you a {order.sellerReview?.rating}-star review
                      </span>
                    )}
                    <p className="flex self-center text-sm font-normal italic">{TimeAgo.dayWithTime(`${order?.events.sellerReview}`)}</p>
                  </div>
                  <div>{!orderReviewModal.sellerPanel ? <FaChevronDown size={15} /> : <FaChevronUp size={15} />}</div>
                </div>
                {orderReviewModal.sellerPanel && (
                  <div className="my-3 flex flex-col">
                    <div className="relative overflow-x-auto">
                      <div className="border-grey w-full rounded border text-left text-sm text-gray-500">
                        <div className="border-grey border-b bg-[#fafafb] py-3 font-medium uppercase">
                          <span className="px-5">
                            {authUser?.email === order.sellerEmail ? 'Your Review' : `${order.buyerEmail}'s Review`}
                          </span>
                        </div>
                        <div className="flex w-full cursor-pointer flex-col items-center space-x-4 px-5 py-4 md:flex-row">
                          <div className="flex w-full justify-center md:w-12 md:self-start">
                            <img className="h-10 w-10 rounded-full object-cover" src={order.sellerImage} alt="Buyer Image" />
                          </div>
                          <div className="w-full text-sm dark:text-white">
                            <div className="flex justify-between text-sm font-bold text-[#777d74] md:text-base">
                              <div className="flex flex-row gap-2">
                                {authUser?.email === order.sellerEmail ? 'Me' : order.sellerEmail}
                                <div className="flex self-center">
                                  <div className="flex flex-row items-center gap-x-1">
                                    <StarRating value={order.sellerReview.rating} size={14} />
                                  </div>
                                  <div className="ml-1 flex gap-1 text-sm">
                                    <span className="text-orange-400">({order.sellerReview?.rating})</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-1 flex flex-col justify-between text-[#777d74]">
                              <span className="text-sm md:text-[15px]">{order.sellerReview?.review}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderReview;
