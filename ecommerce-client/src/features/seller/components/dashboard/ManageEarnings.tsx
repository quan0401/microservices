import { parse } from 'date-fns';
import { filter, lowerCase, sumBy } from 'lodash';
import { FC, ReactElement } from 'react';
import { useOutletContext } from 'react-router-dom';
import { IOrderDocument } from '~features/order/interfaces/order.interface';
import { SellerContextType } from '~features/seller/interfaces/seller.interface';
import { shortenLargeNumbers } from '~shared/utils/utils.service';
import ManageEarningsTable from './components/ManageEarningsTable';

const ManageEarnings: FC = (): ReactElement => {
  const { orders, seller } = useOutletContext<SellerContextType>();
  const complededOrders: IOrderDocument[] = filter(orders, (order: IOrderDocument) => lowerCase(order.status) === lowerCase('Delivered'));
  const sum: number = sumBy(orders, 'price');
  const average: number = sum / orders.length;
  const averageSellingPrice = average ? parseInt(shortenLargeNumbers(average)) : 0;

  return (
    <div className="container mx-auto mt-8">
      <div className="flex flex-col flex-wrap">
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3">
          <div className="border border-grey flex items-center justify-center p-8 sm:col-span-1">
            <div className="flex flex-col gap-3">
              <span className="text-center text-base lg:text-xl">Earnings to date</span>
              <span className="text-center font-bold text-base md:text-xl lg:text-2xl truncate">$${seller?.totalEarnings}</span>
            </div>
          </div>
          <div className="border border-grey flex items-center justify-center p-8 sm:col-span-1">
            <div className="flex flex-col gap-3">
              <span className="text-center text-base lg:text-xl">Avg. selling price</span>
              <span className="text-center font-bold text-base md:text-xl lg:text-2xl truncate">${averageSellingPrice}</span>
            </div>
          </div>
          <div className="border border-grey flex items-center justify-center p-8 sm:col-span-1">
            <div className="flex flex-col gap-3">
              <span className="text-center text-base lg:text-xl">Orders completed</span>
              <span className="text-center font-bold text-base md:text-xl lg:text-2xl truncate">{seller?.completedJobs}</span>
            </div>
          </div>
        </div>

        {/* <!-- ManageEarningsTable --> */}

        <ManageEarningsTable type="active" orders={complededOrders} orderTypes={complededOrders.length} />
      </div>
    </div>
  );
};

export default ManageEarnings;
