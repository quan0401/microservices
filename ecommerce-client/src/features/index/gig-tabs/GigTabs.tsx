import { FC, ReactElement, useState } from 'react';

import { categories, lowerCase, replaceAmpersandAndDashWithSpace, replaceSpacesWithDash } from '~/shared/utils/utils.service';
import { useGetAuthGigsByCategoryQuery } from '~features/auth/services/auth.service';
import { ISellerGig } from '~features/gigs/interfaces/gig.interface';
import TopGigsView from '~shared/gigs/TopGigsView';

const GigTabs: FC = (): ReactElement => {
  const [activeTab, setActiveTab] = useState<string>('Graphics & Design');
  const queryType = `query=${replaceAmpersandAndDashWithSpace(`${lowerCase(activeTab)}`)}`;
  const { data, isSuccess } = useGetAuthGigsByCategoryQuery({
    query: `${queryType}`,
    from: '0',
    size: 10,
    type: 'forward'
  });
  let categoryGigs: ISellerGig[] = [];
  if (isSuccess) {
    categoryGigs = data.gigs as ISellerGig[];
  }

  return (
    <div className="relative m-auto mt-8 w-screen px-6 xl:container md:px-12 lg:px-6">
      <div className="mx-auto flex flex-col px-4 py-8 lg:px-6 lg:py-10">
        <div className="flex flex-col text-left">
          <h2 className="mb-3 text-3xl font-bold text-black">A broad selection of services</h2>
          <h4>Choose from a broad selection of services from expert freelancers for your next project.</h4>
        </div>
        <div className="mt-6">
          <ul className="lg:flex lg:justify-between gap-5 overflow-x-auto scroll-smooth whitespace-nowrap relative inline-block">
            {categories().map((category: string, index: number) => (
              <li
                key={index}
                onClick={() => setActiveTab(category)}
                // lg:py-0 lg xl xxl will apply py-0
                className={`cursor-pointer font-bold py-2 lg:py-0
                  ${activeTab === category ? 'text-black' : 'text-gray-400'}`}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 h-full overflow-hidden border px-6 py-6">
          {categoryGigs.length > 0 ? (
            <>
              <a
                className="mt-10 w-[10%] rounded border border-black px-6 py-3 text-center text-sm font-bold text-black hover:bg-gray-100 focus:outline-none md:px-4 md:py-2 md:text-base"
                href={`/search/categories/${replaceSpacesWithDash(activeTab)}`}
              >
                Explore
              </a>
              <TopGigsView gigs={categoryGigs} width="w-72" type="index" />
            </>
          ) : (
            <div className="flex h-96 items-center justify-center text-gray-800 text-lg">Information not available at the moment.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigTabs;
