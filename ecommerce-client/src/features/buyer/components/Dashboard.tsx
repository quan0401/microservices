import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BuyerTable from './BuyerTable';
import { orderTypes } from '~shared/utils/utils.service';
import { IOrderDocument } from '~features/order/interfaces/order.interface';
import { socket, socketService } from '~/sockets/socket.service';
import { useGetOrdersByBuyerIdQuery } from '~features/order/services/order.service';

const BUYER_GIG_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in_progress',
  DELIVERED: 'delivered'
};

const BuyerDashboard = () => {
  const [type, setType] = useState<string>(BUYER_GIG_STATUS.ACTIVE);
  const { buyerId } = useParams<string>();
  const { data, isSuccess } = useGetOrdersByBuyerIdQuery(`${buyerId}`);
  let orders: IOrderDocument[] = [];
  let filterOrders: IOrderDocument[] = [];
  if (isSuccess) {
    orders = data.orders as IOrderDocument[];
    filterOrders = orderTypes(type, orders);
  }

  useEffect(() => {
    // socketService.setupSocketConnection();
    socket.emit('getLoggedInUsers', '');
  }, []);

  return (
    <div className="container mx-auto mt-8 px-6 md:px-12 lg:px-6">
      <div className="flex flex-col flex-wrap">
        <div className="mb-8 px-4 text-xl font-semibold text-black md:px-0 md:text-2xl lg:text-4xl">Manage Orders</div>
        <div className="p-0">
          <ul className="flex w-full cursor-pointer list-none flex-col flex-wrap rounded-[2px] sm:flex-none sm:flex-row">
            <li className="inline-block py-3 uppercase" onClick={() => setType(BUYER_GIG_STATUS.ACTIVE)}>
              <a
                href="#activeorders"
                className={`px-4 py-3 text-xs text-[#555555] no-underline sm:text-sm md:text-base ${
                  type === BUYER_GIG_STATUS.ACTIVE ? 'pb-[15px] outline outline-1 outline-[#e8e8e8] sm:rounded-t-lg' : ''
                }`}
              >
                Active{' '}
                <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                  {orderTypes(BUYER_GIG_STATUS.ACTIVE, orders).length}
                </span>
              </a>
            </li>
            <li className="inline-block py-3 uppercase" onClick={() => setType(BUYER_GIG_STATUS.COMPLETED)}>
              <a
                href="#activeorders"
                className={`px-4 py-3 text-xs text-[#555555] no-underline sm:text-sm md:text-base ${
                  type === BUYER_GIG_STATUS.COMPLETED ? 'pb-[15px] outline outline-1 outline-[#e8e8e8] sm:rounded-t-lg' : ''
                }`}
              >
                Completed{' '}
                <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                  {orderTypes(BUYER_GIG_STATUS.COMPLETED, orders).length}
                </span>
              </a>
            </li>
            <li className="inline-block py-3 uppercase" onClick={() => setType(BUYER_GIG_STATUS.CANCELLED)}>
              <a
                href="#activeorders"
                className={`px-4 py-3 text-xs text-[#555555] no-underline sm:text-sm md:text-base ${
                  type === BUYER_GIG_STATUS.CANCELLED ? 'pb-[15px] outline outline-1 outline-[#e8e8e8] sm:rounded-t-lg' : ''
                }`}
              >
                Cancelled{' '}
                <span className="ml-1 rounded-[5px] bg-sky-500 px-[5px] py-[1px] text-xs font-medium text-white">
                  {orderTypes(BUYER_GIG_STATUS.CANCELLED, orders).length}
                </span>
              </a>
            </li>
          </ul>
        </div>

        {type === BUYER_GIG_STATUS.ACTIVE && <BuyerTable type="active" orders={filterOrders} orderTypes={filterOrders.length} />}
        {type === BUYER_GIG_STATUS.COMPLETED && <BuyerTable type="completed" orders={filterOrders} orderTypes={filterOrders.length} />}
        {type === BUYER_GIG_STATUS.CANCELLED && <BuyerTable type="cancelled" orders={filterOrders} orderTypes={filterOrders.length} />}
      </div>
    </div>
  );
};

export default BuyerDashboard;
