import { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { IGigsProps, IPaginateType, ISellerGig } from '~features/gigs/interfaces/gig.interface';
import BudgetDropdown from './components/BudgetDropdown';
import DeliveryTimeDropdown from './components/DeliveryTimeDropdown';
import { Location, useLocation, useParams, useSearchParams } from 'react-router-dom';
import {
  categories,
  getDataFromLocalStorage,
  replaceAmpersandAndDashWithSpace,
  replaceDashWithSpaces,
  replaceSpacesWithDash,
  saveToLocalStorage
} from '~shared/utils/utils.service';
import { find, lowerCase } from 'lodash';
import { useSearchGigsQuery } from '~features/gigs/services/search.service';
import CircularPageLoader from '~shared/page-loader/CircularPageLoader';
import GigCardDisplayItem from '~shared/gigs/GigCardDisplayItem';
import { v4 as uuidv4 } from 'uuid';
import PageMessage from '~shared/page-message/PageMessage';
import GigPaginate from '~shared/gigs/GigPaginate';

const initItemPerPage = 2;

const Gigs: FC<IGigsProps> = ({ type }): ReactElement => {
  const [itemFrom, setItemFrom] = useState<string>('0');
  const [itemsPerPage, setItemsPerPage] = useState<number>(initItemPerPage);
  const [paginationType, setPaginationType] = useState<IPaginateType>('forward');
  const [searchParams] = useSearchParams();
  const { category } = useParams<string>();
  const location: Location = useLocation();
  const updatedSearchParams: URLSearchParams = new URLSearchParams(searchParams.toString());
  const queryType: string =
    type === 'search'
      ? replaceDashWithSpaces(`${updatedSearchParams}`)
      : `query=${replaceAmpersandAndDashWithSpace(lowerCase(`${category}`))}&${updatedSearchParams.toString()}`;
  const { data, isSuccess, isLoading, isError } = useSearchGigsQuery({
    query: `${queryType}`,
    from: itemFrom,
    size: `${itemsPerPage}`,
    type: paginationType
  });
  const gigs = useRef<ISellerGig[]>([]);
  let totalGigs = 0;
  const filterApplied = getDataFromLocalStorage('filterApplied');
  const categoryName = find(categories(), (item: string) => location.pathname.includes(replaceSpacesWithDash(`${lowerCase(`${item}`)}`)));

  const sortLength: number = (data?.sort && data.sort.length) ?? 0;

  const gigCategories = categoryName ?? searchParams.get('query');

  if (isSuccess && sortLength === 0) {
    gigs.current = data.gigs as ISellerGig[];
    totalGigs = data.total ?? 0;
    saveToLocalStorage('filterApplied', JSON.stringify(false));
  }
  useEffect(() => {
    if (sortLength > 0 && data?.sort) {
      const isFirstPage = itemsPerPage === initItemPerPage;
      setPaginationType('forward');
      setItemsPerPage(initItemPerPage);
      setItemFrom(!isFirstPage ? `${data.sort[sortLength - 1]}` : '0');
    }
  }, [sortLength === 0]);

  return (
    <>
      {isLoading && !isSuccess ? (
        <CircularPageLoader />
      ) : (
        <div className="container mx-auto items-center p-5">
          {!isLoading && data?.gigs?.length ? (
            <>
              <h3 className="mb-5 flex gap-3 text-3xl">
                {type === 'search' && <span className="text-black">Results for</span>}
                <strong className="text-black">{gigCategories}</strong>
              </h3>
              <div className="mb-4 flex gap-4">
                <BudgetDropdown />
                <DeliveryTimeDropdown />
              </div>
              <div className="my-5">
                <div className="">
                  <span className="font-medium text-[#74767e]">5 services available</span>
                </div>
                {filterApplied ? (
                  <CircularPageLoader />
                ) : (
                  <div className="grid gap-x-6 pt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {data?.gigs &&
                      data.gigs.map((gig: ISellerGig) => <GigCardDisplayItem key={uuidv4()} gig={gig} linkTarget showEditIcon={false} />)}
                  </div>
                )}
              </div>
            </>
          ) : (
            <PageMessage
              header="No services found for your search"
              body="Try a new search or get a free quote for your project from our community of freelancers."
            />
          )}

          {isError && <PageMessage header="Services issue" body="A network issue occured. Try again later" />}

          <GigPaginate
            gigs={gigs.current}
            totalGigs={totalGigs}
            showNumbers
            itemsPerPage={itemsPerPage}
            setItemFrom={setItemFrom}
            setPaginationType={setPaginationType}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}
    </>
  );
};

export default Gigs;
