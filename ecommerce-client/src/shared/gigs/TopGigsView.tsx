import { FC, ReactElement, useRef, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { IGigTopProps, ISellerGig } from '~features/gigs/interfaces/gig.interface';
import { firstLetterUppercase, replaceSpacesWithDash } from '~shared/utils/utils.service';
import GigCardDisplayItem from './GigCardDisplayItem';
import { socket } from '~/sockets/socket.service';

interface IScrollProps {
  atStart: boolean;
  atEnd: boolean;
}

const TopGigsView: FC<IGigTopProps> = ({ gigs, title, subTitle, category, width, type }): ReactElement => {
  const navElement = useRef<HTMLDivElement | null>(null);
  const [scroll, setScroll] = useState<IScrollProps>({
    atStart: true,
    atEnd: false
  });

  const handleOnScroll = () => {
    if (!navElement.current) return;
    const maxScrollWidth = navElement.current.scrollWidth - navElement.current.clientWidth;
    const currentScrollPos = navElement.current.scrollLeft;
    if (currentScrollPos === 0) {
      setScroll({
        atStart: true,
        atEnd: false
      });
    } else if (currentScrollPos === maxScrollWidth) {
      setScroll({
        atStart: false,
        atEnd: true
      });
    } else {
      if (scroll.atEnd !== scroll.atStart) {
        setScroll({
          atStart: false,
          atEnd: false
        });
      }
    }
  };

  const slideLeft = () => {
    if (!navElement.current) return;
    const currentScrollPos = navElement.current.scrollLeft;
    const newScrollPos = currentScrollPos - 500 > 0 ? currentScrollPos - 500 : 0;
    navElement.current.scrollTo({
      left: newScrollPos,
      behavior: 'smooth'
    });
    setScroll({
      atStart: newScrollPos === 0,
      atEnd: false
    });
  };
  const slideRight = () => {
    if (!navElement.current) return;
    const currentScrollPos = navElement.current.scrollLeft;
    const maxScrollWidth = navElement.current.scrollWidth - navElement.current.clientWidth;
    const newScrollPos = currentScrollPos + 500 < maxScrollWidth ? currentScrollPos + 500 : maxScrollWidth;
    navElement.current.scrollTo({
      left: newScrollPos,
      behavior: 'smooth'
    });
    setScroll({
      atStart: false,
      atEnd: newScrollPos === maxScrollWidth
    });
  };

  return (
    <div className="mx-auto my-8 flex flex-col overflow-hidden rounded-lg">
      {title && (
        <div className="flex items-start py-6">
          <div className="flex w-full flex-col justify-between">
            <div className="flex gap-2">
              <h2 className="text-base font-bold md:text-lg lg:text-2xl">{title}</h2>

              {category && (
                <span className="flex self-center text-base font-bold cursor-pointer text-sky-500 md:text-lg lg:text-2xl hover:text-sky-400 hover:underline">
                  <Link onClick={() => socket.emit('getLoggedInUsers', '')} to={`/categories/${replaceSpacesWithDash(category)}`}>
                    {category}
                  </Link>
                </span>
              )}
            </div>
            <h4 className="pt-1 text-left text-sm">{subTitle}</h4>
          </div>
        </div>
      )}

      {/* <div className="m-auto flex h-96 w-full overflow-x-auto" ref={navElement}> */}
      <div className="m-auto flex w-full overflow-x-auto" onScroll={handleOnScroll} ref={navElement}>
        {!scroll.atStart && gigs.length > 2 && (
          <span
            onClick={slideLeft}
            className="absolute left-2 z-50 flex cursor-pointer justify-start self-center rounded-full bg-sky-400 sm:left-3 md:left-7 lg:left-0"
          >
            <FaAngleLeft className="text-3xl text-white sm:text-3xl md:text-4xl lg:text-4xl" />
          </span>
        )}
        <div className="relative flex gap-x-8 pt-3">
          {gigs.map((gig: ISellerGig) => (
            <div key={uuidv4()} className="">
              {type === 'home' || type === 'index' ? <GigCardDisplayItem gig={gig} linkTarget={false} showEditIcon={false} /> : <></>}
            </div>
          ))}
        </div>

        {!scroll.atEnd && gigs.length > 2 && (
          <span
            onClick={slideRight}
            className="absolute right-2 flex max-w-4xl cursor-pointer justify-end self-center rounded-full bg-sky-400 sm:right-3 md:right-7 lg:right-0"
          >
            <FaAngleRight className="text-3xl text-white sm:text-3xl md:text-4xl lg:text-4xl" />
          </span>
        )}
      </div>
    </div>
  );
};

export default TopGigsView;
