import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { FaRegClock, FaRegMoneyBillAlt, FaCog } from 'react-icons/fa';
import { createSearchParams, NavigateFunction, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ISellerGig } from '~features/gigs/interfaces/gig.interface';
import { IOffer } from '../interfaces/order.interface';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './checkout-form/CheckoutForm';
import { IResponse } from '~shared/shared.interface';
import { saveToLocalStorage, showErrorToast } from '~shared/utils/utils.service';
import { useCreateOrderIntentMutation } from '../services/order.service';
import Button from '~shared/button/Button';

const Checkout: FC = (): ReactElement => {
  const stripePromise = useMemo(() => loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY), []);
  const [clientSecret, setClientSecret] = useState<string>('');
  const { gigId = '' } = useParams<{ gigId: string }>();
  const [searchParams] = useSearchParams();
  const { state }: { state: ISellerGig } = useLocation();
  const [offer] = useState<IOffer>(JSON.parse(`${searchParams.get('offer')}`));
  const [createOrderIntent] = useCreateOrderIntentMutation();
  const navigate: NavigateFunction = useNavigate();

  // the service charge is 5.5% of the purchase amount
  // for purchases under $50, an additional $2 is applied
  const serviceFee: number = offer.price < 50 ? (5.5 / 100) * offer.price + 2 : (5.5 / 100) * offer.price;

  const options = { clientSecret } as StripeElementsOptions;

  const createBuyerOrderIntent = async (): Promise<void> => {
    try {
      const response: IResponse = await createOrderIntent(offer.price).unwrap();
      setClientSecret(`${response.clientSecret}`);
      saveToLocalStorage('paymentIntentId', JSON.stringify(`${response.paymentIntentId}`));
    } catch (error) {
      showErrorToast('Error with checkout.');
    }
  };

  // useEffect(() => {
  //   createBuyerOrderIntent();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="container mx-auto h-screen">
      <div className="flex flex-wrap">
        <div className="w-full p-4 lg:w-2/3 order-last lg:order-first">
          <div className="border border-grey">
            <div className="text-xl font-medium mb-3 pt-3 pb-4 px-4">
              <span>Payment</span>
              <Button
                onClick={() => {
                  navigate(
                    `/gig/order/requirement/${gigId}?${createSearchParams({
                      offer: JSON.stringify(offer),
                      order_date: `${new Date()}`
                    })}`
                  );
                }}
                className="bg-sky-500 text-white text-sm font-bold px-4 py-2 rounded float-right"
                label="Fake pay"
              />
            </div>
            {clientSecret && (
              <Elements options={options} key={clientSecret} stripe={stripePromise}>
                <CheckoutForm gigId={`${gigId}`} offer={offer} />
              </Elements>
            )}
          </div>
        </div>

        <div className="w-full p-4 lg:w-1/3">
          <div className="border border-grey mb-8">
            <div className="pt-3 pb-4 px-4 mb-2 flex flex-col border-b md:flex-row">
              <img className="object-cover w-20 h-11" src={state.coverImage} alt="Gig Cover Image" />
              <h4 className="font-bold text-sm text-[#161c2d] mt-2 md:pl-4 md:mt-0">{state.title}</h4>
            </div>
            <ul className="list-none mb-0">
              <li className="flex px-4 pt-1 pb-3 border-b border-grey">
                <div className="font-normal text-sm">{state.description}</div>
              </li>
              <li className="flex justify-between px-4 pt-2 pb-2">
                <div className="text-sm font-normal flex gap-2">
                  <FaRegClock className="self-center" /> Expected delivery time
                </div>
                <span className="text-sm">
                  {' '}
                  {offer.deliveryInDays} day{offer.deliveryInDays > 1 ? 's' : ''}
                </span>
              </li>
              <li className="flex justify-between px-4 pt-2 pb-2">
                <div className="text-sm font-normal flex gap-2">
                  <FaRegMoneyBillAlt className="self-center" /> Price
                </div>
                <span className="text-sm">${offer.price}</span>
              </li>
              <li className="flex justify-between px-4 pt-2 pb-2">
                <div className="text-sm font-normal flex gap-2">
                  <FaCog className="self-center" /> Service fee
                </div>
                <span className="text-sm">${serviceFee.toFixed(2)}</span>
              </li>
              <div className="border-b border-grey" />
              <li className="flex justify-between px-4 py-4">
                <div className="text-sm md:text-base font-semibold flex gap-2">
                  <FaCog className="self-center" /> Total
                </div>
                <span className="text-sm md:text-base font-semibold">${offer.price + serviceFee}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
