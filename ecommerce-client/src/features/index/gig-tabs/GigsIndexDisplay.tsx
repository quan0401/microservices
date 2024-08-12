import { find, lowerCase } from 'lodash';
import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useGetAuthGigsByCategoryQuery } from '~features/auth/services/auth.service';
import { IGigsProps, IPaginateType, ISellerGig } from '~features/gigs/interfaces/gig.interface';
import GigPaginate from '~shared/gigs/GigPaginate';
import Header from '~shared/header/components/Header';
import CircularPageLoader from '~shared/page-loader/CircularPageLoader';
import PageMessage from '~shared/page-message/PageMessage';
import { categories, replaceAmpersandAndDashWithSpace, replaceDashWithSpaces, replaceSpacesWithDash } from '~shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

import GigIndexItem from './GigIndexItem';

const ITEMS_PER_PAGE = 12;

const GigsIndexDisplay: FC<IGigsProps> = ({ type }): ReactElement => {
  const [itemFrom, setItemFrom] = useState<string>('0');
  const [itemsPerPage, setItemsPerPage] = useState<number>(ITEMS_PER_PAGE);
  const [paginationType, setPaginationType] = useState<IPaginateType>('forward');
  const gigsCurrent = useRef<ISellerGig[]>([]);
  const { category } = useParams<string>();
  const [searchParams] = useSearchParams({});
  const location = useLocation();
  let gigs: ISellerGig[] = [];
  let totalGigs = 0;
  const updatedSearchParams: URLSearchParams = new URLSearchParams(searchParams.toString());
  const queryType: string =
    type === 'search'
      ? replaceDashWithSpaces(`${updatedSearchParams}`)
      : `query=${replaceAmpersandAndDashWithSpace(`${lowerCase(`${category}`)}`)}&${updatedSearchParams.toString()}`;
  const { data, isSuccess, isLoading, isError } = useGetAuthGigsByCategoryQuery({
    query: `${queryType}`,
    from: itemFrom,
    size: ITEMS_PER_PAGE,
    type: paginationType
  });

  const sortLength: number = (data?.sort && data.sort.length) ?? 0;
  if (isSuccess && sortLength === 0) {
    gigs = data.gigs as ISellerGig[];
    gigsCurrent.current = data?.gigs as ISellerGig[];
    totalGigs = data.total ?? 0;
  }
  useEffect(() => {
    if (sortLength > 0 && data?.sort) {
      const isFirstPage = itemsPerPage === ITEMS_PER_PAGE;
      setPaginationType('forward');
      setItemsPerPage(ITEMS_PER_PAGE);
      setItemFrom(!isFirstPage ? `${data.sort[sortLength - 1]}` : '0');
    }
  }, [sortLength === 0]);

  const categoryName = find(categories(), (item: string) => location.pathname.includes(replaceSpacesWithDash(`${lowerCase(`${item}`)}`)));
  const gigCategories = categoryName ?? searchParams.get('query');

  return (
    <div className="flex w-screen flex-col">
      <Header navClass="navbar peer-checked:navbar-active z-20 w-full border-b border-gray-100 bg-white/90 shadow-2xl shadow-gray-600/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none" />
      <div className="relative m-auto mb-10 mt-8 min-h-screen w-screen px-6 xl:container md:px-12 lg:px-6">
        {isLoading && !isSuccess ? (
          <CircularPageLoader />
        ) : (
          <>
            {!isLoading && gigs.length > 0 ? (
              <>
                <h3 className="mb-5 flex gap-3 text-4xl">
                  {type === 'search' && <span className="text-black">Results for</span>}
                  <strong className="text-black">{gigCategories}</strong>
                </h3>
                <div className="my-5">
                  <div className="grid gap-x-6 pt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {gigs.map((gig: ISellerGig) => (
                      <GigIndexItem key={uuidv4()} gig={gig} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <PageMessage
                header="No services found for your search"
                body="Try a new search or get a free quote for your project from our commnunity of freelancers."
              />
            )}
          </>
        )}
        {isError && <PageMessage header="Services issue" body="A network issue occured. Try agin later." />}
        {gigs.length > 0 && (
          <GigPaginate
            gigs={gigsCurrent.current}
            totalGigs={totalGigs}
            // showNumbers={false}
            showNumbers
            itemsPerPage={itemsPerPage}
            setItemFrom={setItemFrom}
            setPaginationType={setPaginationType}
            setItemsPerPage={setItemsPerPage}
          />
        )}
      </div>
    </div>
  );
};

export default GigsIndexDisplay;
