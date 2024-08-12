import { FC, ReactElement, useState } from 'react';
import { FaPencilAlt, FaPlayCircle, FaPauseCircle, FaTrashAlt, FaEllipsisH, FaRegStar, FaStar } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch } from 'react-redux';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '~/store/store';
import { IGigsProps } from '~features/gigs/interfaces/gig.interface';
import { useDeleteGigMutation, useUpdateActiveGigMutation } from '~features/gigs/services/gigs.service';
import { updateHeader } from '~shared/header/reducers/header.reducer';
import ApprovalModal from '~shared/modals/ApprovalModal';
import { IApprovalModalContent } from '~shared/modals/interfaces/modal.interface';
import { IGigCardItemModal } from '~shared/shared.interface';
import { lowerCase, rating, replaceSpacesWithDash, showErrorToast, showSuccessToast } from '~shared/utils/utils.service';

const GigCardItem: FC<IGigsProps & { gig: NonNullable<IGigsProps['gig']> }> = ({ gig }): ReactElement => {
  const [gigCardItemModal, setGigCardItemModal] = useState<IGigCardItemModal>({
    overlay: false,
    deleteApproval: false
  });
  const [approvalModalContent, setApprovalModalContent] = useState<IApprovalModalContent>();
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();
  const title: string = replaceSpacesWithDash(gig.title);
  const [updateActiveGig] = useUpdateActiveGigMutation();
  const [deleteGig] = useDeleteGigMutation();

  const navigateToEditGig = (gigId: string): void => {
    setGigCardItemModal({ ...gigCardItemModal, overlay: false });
    dispatch(updateHeader('home'));
    navigate(`/manage_gigs/edit/${gigId}`, { state: gig });
  };

  const onToggleGig = async (active: boolean): Promise<void> => {
    try {
      const updatedGig = await updateActiveGig({ gigId: `${gig.id}`, active }).unwrap();
      setGigCardItemModal({ ...gigCardItemModal, overlay: false });
      showSuccessToast('Gig status updated successfully');
    } catch (error) {
      showErrorToast('Error setting gig status.');
    }
  };

  const onDeleteGig = async (): Promise<void> => {
    try {
      await deleteGig({ gigId: `${gig.id}`, sellerId: `${gig.sellerId}` }).unwrap();
      setGigCardItemModal({ deleteApproval: false, overlay: false });
      showSuccessToast('Gig deleted successfully.');
    } catch (error) {
      showErrorToast('Error setting gig status.');
    }
  };

  return (
    <>
      {gigCardItemModal.deleteApproval && (
        <ApprovalModal
          approvalModalContent={approvalModalContent}
          onClick={onDeleteGig}
          onClose={() => setGigCardItemModal({ ...gigCardItemModal, deleteApproval: false })}
        />
      )}
      <div className="relative">
        {gigCardItemModal.overlay && (
          <div className="border-grey absolute bottom-0 top-0 mb-8 w-full cursor-pointer border bg-white">
            <div
              onClick={() => setGigCardItemModal({ ...gigCardItemModal, overlay: false })}
              className="absolute -right-[12px] -top-[12px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-sky-500 bg-white text-sm font-bold leading-[0] text-sky-500"
            >
              X
            </div>
            <ul className="list-none pl-0">
              <li>
                <div onClick={() => navigateToEditGig(`${gig.id}`)} className="my-1 flex w-full cursor-pointer gap-4 px-4 pt-3">
                  <FaPencilAlt size={13} className="flex self-center" />
                  <span className="">Edit</span>
                </div>
              </li>
              <li>
                <div onClick={() => onToggleGig(!gig.active)} className="my-1 flex w-full cursor-pointer gap-4 px-4 pt-3">
                  {!gig.active ? (
                    <FaPlayCircle size={13} className="flex self-center" />
                  ) : (
                    <FaPauseCircle size={13} className="flex self-center" />
                  )}
                  <span className="">{!gig.active ? 'Activate' : 'Pause'}</span>
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    setApprovalModalContent({
                      header: 'Delete this Gig',
                      body: 'Are you sure you want to permanently delete this gig?',
                      btnText: 'Delete',
                      btnColor: 'bg-red-500'
                    });
                    setGigCardItemModal({ ...gigCardItemModal, deleteApproval: true });
                  }}
                  className="my-1 flex w-full cursor-pointer gap-4 px-4 pt-3"
                >
                  <FaTrashAlt size={13} className="flex self-center" />
                  <span className="">Delete</span>
                </div>
              </li>
            </ul>
          </div>
        )}
        <div className="border-grey mb-8 flex cursor-pointer flex-col gap-2 border">
          <Link
            onClick={() => dispatch(updateHeader('home'))}
            to={`/gig/${lowerCase(`${gig.username}/${title}/${gig.sellerId}/${gig.id}/view`)}`}
          >
            <LazyLoadImage
              src={gig.coverImage}
              alt="Gig cover image"
              className="w-full"
              placeholderSrc="https://placehold.co/330x220?text=Profile+Image"
            />
          </Link>
          <div className="px-2">
            <Link
              onClick={() => dispatch(updateHeader('home'))}
              to={`/gig/${lowerCase(`${gig.username}/${title}/${gig.sellerId}/${gig.id}/view`)}`}
            >
              <p className="line-clamp-2 text-[#404145] hover:text-sky-500">{gig.basicDescription}</p>
            </Link>
          </div>
          <div className="flex gap-2 px-2 text-orange-400">
            {parseInt(`${gig.ratingsCount}`) > 0 ? <FaStar color="orange" className="mt-1" /> : <FaRegStar className="mt-1" />}(
            {rating(parseInt(`${gig.ratingSum}`) / parseInt(`${gig.ratingsCount}`))}) (5)
          </div>
          <div className="flex justify-between px-2 pb-2">
            <FaEllipsisH size={14} className="self-center" onClick={() => setGigCardItemModal({ ...gigCardItemModal, overlay: true })} />
            <strong className="text-base font-normal">${gig.price}</strong>
          </div>
        </div>
      </div>
    </>
  );
};

export default GigCardItem;
