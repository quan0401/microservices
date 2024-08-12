import { find } from 'lodash';
import { FC, ReactElement, useEffect, useRef } from 'react';
import { FaPencilAlt, FaRegStar, FaStar } from 'react-icons/fa';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { socket } from '~/sockets/socket.service';
import { useAppSelector } from '~/store/store';
import { IReduxState } from '~/store/store.interface';
import { IGigCardItems, ISellerGig } from '~features/gigs/interfaces/gig.interface';
import { lowerCase, rating, replaceAmpersandAndDashWithSpace, replaceSpacesWithDash } from '~shared/utils/utils.service';

const GigCardDisplayItem: FC<IGigCardItems> = ({ gig, linkTarget, showEditIcon }): ReactElement => {
  const seller = useAppSelector((state: IReduxState) => state.seller);
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const sellerEmail = useRef<string>('');
  const title: string = replaceSpacesWithDash(gig.title);
  const navigate: NavigateFunction = useNavigate();

  const navigateToEditGig = (gigId: string): void => {
    navigate(`/manage_gigs/edit/${gigId}`, { state: gig });
  };

  const saveGigTitle = (gig: ISellerGig): void => {
    if (authUser?.email) {
      const category: string = replaceAmpersandAndDashWithSpace(gig.categories);
      socket.emit('category', category, authUser.email);
    }
  };

  useEffect(() => {
    // socketService.setupSocketConnection();
    socket.emit('getLoggedInUsers', '');
    socket.on('online', (data: string[]) => {
      sellerEmail.current = find(data, (email: string) => email === authUser.email) as string;
    });
  }, [authUser.email]);

  return (
    <div className="rounded w-72">
      <div className="mb-8 flex cursor-pointer flex-col gap-2">
        <Link onClick={() => saveGigTitle(gig)} to={`/gig/${lowerCase(`${gig.username}/${title}/${gig.sellerId}/${gig.id}/view`)}`}>
          <img src={gig.coverImage} alt="Gig cover image" className={`w-full rounded-lg h-72 object-cover`} />
        </Link>
        <div className="flex items-center gap-2 relative">
          <img src={gig.profilePicture} alt="Profile image" className="h-7 w-8 rounded-full object-cover" />
          {seller.current === gig.email && (
            <span className="bottom-0 left-5 absolute w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
          )}
          <div className="flex w-full justify-between">
            <span className="text-md hover:underline">
              {linkTarget ? (
                <Link
                  to={`/seller_profile/${lowerCase(`${gig.username}/${gig.sellerId}/${seller.email === gig.email ? 'edit' : 'view'}`)}`}
                >
                  <strong className="text-sm font-medium md:text-base">{gig.username}</strong>
                </Link>
              ) : (
                <strong className="text-sm font-medium md:text-base">{gig.username}</strong>
              )}
            </span>
            {showEditIcon && <FaPencilAlt onClick={() => navigateToEditGig(`${gig.id}`)} className="mr-2 flex self-center" size={15} />}
          </div>
        </div>
        <div>
          <Link onClick={() => saveGigTitle(gig)} to={`/gig/${lowerCase(`${gig.username}/${title}/${gig.sellerId}/${gig.id}/view`)}`}>
            <p className="line-clamp-2 text-sm text-[#404145] hover:underline md:text-base">{gig.basicDescription}</p>
          </Link>
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          {parseInt(`${gig.ratingsCount}`) > 0 ? <FaStar /> : <FaRegStar />}
          <strong className="text-sm font-bold">({rating(parseInt(`${gig.ratingSum}`) / parseInt(`${gig.ratingsCount}`))})</strong>
        </div>
        <div>
          <strong className="text-sm font-bold md:text-base">From ${gig.price}</strong>
        </div>
      </div>
    </div>
  );
};

export default GigCardDisplayItem;
