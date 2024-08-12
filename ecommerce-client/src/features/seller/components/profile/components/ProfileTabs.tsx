import { FC, ReactElement } from 'react';
import { IProfileTabsProps } from '~features/seller/interfaces/seller.interface';
import Dropdown from '~shared/dropdown/Dropdown';

const ProfileTabs: FC<IProfileTabsProps> = ({ type, setType }): ReactElement => {
  return (
    <>
      <div className="sm:hidden bg-white border-grey">
        <Dropdown text={type} maxHeight="300" values={['Overview', 'Active', 'Ratings & Reviews']} setValue={setType} />
      </div>
      <ul className="hidden divide-x divide-gray-200 text-center text-sm font-medium text-gray-500 shadow dark:text-gray-400 sm:flex">
        <li className="w-full">
          <div
            onClick={() => {
              if (setType) {
                setType('Overview');
              }
            }}
            className={`inline-block w-full p-4 text-gray-600 hover:text-gray-700 focus:outline-none
            ${type === 'Overview' ? 'bg-sky-200' : 'bg-white'}
          `}
          >
            Overview
          </div>
        </li>
        <li className="w-full">
          <div
            onClick={() => {
              if (setType) {
                setType('Active');
              }
            }}
            className={`inline-block w-full p-4 text-gray-600 hover:text-gray-700 focus:outline-none
            ${type === 'Active' ? 'bg-sky-200' : 'bg-white'}
          `}
          >
            Active Gigs
          </div>
        </li>
        <li className="w-full">
          <div
            onClick={() => {
              if (setType) {
                setType('Ratings & Reviews');
              }
            }}
            className={`inline-block w-full p-4 text-gray-600 hover:text-gray-700 focus:outline-none
            ${type === 'Ratings & Reviews' ? 'bg-sky-200' : 'bg-white'}
          `}
          >
            Rating & Reviews
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProfileTabs;
