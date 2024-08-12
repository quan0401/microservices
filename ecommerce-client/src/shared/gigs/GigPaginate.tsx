import { FC, MutableRefObject, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { IGigPaginateProps, ISellerGig } from '~features/gigs/interfaces/gig.interface';

let itemOffset = 1;

const GigPaginate: FC<IGigPaginateProps> = ({
  gigs,
  totalGigs,
  itemsPerPage,
  showNumbers,
  setItemFrom,
  setPaginationType,
  setItemsPerPage
}) => {
  const paginationCount: number[] = [...Array(Math.ceil(totalGigs / itemsPerPage)).keys()];
  const prevButtonRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
  const nextButtonRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   itemOffset = 1;

  //   return () => {
  //     itemOffset = 1;
  //   };
  // }, []);

  return (
    <>
      {gigs?.length > 0 && (
        <div className="flex w-full justify-center">
          <ul className="flex gap-8">
            <div
              ref={prevButtonRef}
              onClick={() => {
                if (itemOffset - 1 > 0) {
                  itemOffset -= 1;
                  setPaginationType('backward');
                  const firstItem: ISellerGig = gigs[0];
                  setItemFrom(`${firstItem.sortId}`);
                }
              }}
              className={`p-3 ${itemOffset - 1 > 0 ? 'cursor-pointer rounded-full border border-sky-400' : 'cursor-not-allowed text-gray-400'}`}
            >
              <FaArrowLeft className="flex self-center" />
            </div>
            {showNumbers &&
              paginationCount.map((_, index: number) => (
                <li
                  key={uuidv4()}
                  className={`cursor-pointer px-3 py-2 ${itemOffset === index + 1 ? 'border-b-2 border-black font-bold text-black' : ''}`}
                  onClick={() => {
                    if (index + 1 === itemOffset) return;
                    if (index + 1 === itemOffset + 1 && nextButtonRef.current) {
                      nextButtonRef.current.click();
                    } else if (index + 1 === itemOffset - 1 && prevButtonRef.current) {
                      prevButtonRef.current.click();
                    } else {
                      // jump forward
                      if (itemOffset < index + 1) {
                        const size: number = index * itemsPerPage;
                        itemOffset = index + 1;
                        setItemFrom('0');
                        setItemsPerPage(size);
                        setPaginationType('jump');
                      } else {
                        // jump forward
                        const size: number = index * itemsPerPage;
                        itemOffset = index + 1;
                        setItemFrom('0');
                        setItemsPerPage((prev: number): number => {
                          return size === 0 ? prev : size;
                        });
                        setPaginationType('jump');
                      }
                    }
                  }}
                >
                  {index + 1}
                </li>
              ))}
            <div
              className={`p-3 ${itemOffset === paginationCount.length ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer rounded-full border border-sky-400'}`}
              ref={nextButtonRef}
              onClick={() => {
                if (itemOffset + 1 <= paginationCount.length) {
                  itemOffset += 1;
                  setPaginationType('forward');
                  const lastItem: ISellerGig = gigs[gigs.length - 1];
                  setItemFrom(`${lastItem.sortId}`);
                }
              }}
            >
              <FaArrowRight className="flex self-center" color={`${itemOffset === paginationCount.length ? 'grey' : 'black'}`} />
            </div>
          </ul>
        </div>
      )}
    </>
  );
};

export default GigPaginate;
