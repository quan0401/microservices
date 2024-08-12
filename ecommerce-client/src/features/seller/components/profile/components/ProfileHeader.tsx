import { ReactElement, FC, useState, ChangeEvent, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { IGigInfo } from '~features/gigs/interfaces/gig.interface';
import { IProfileHeaderProps, ISellerProfileItem, IShowEditItem } from '~features/seller/interfaces/seller.interface';
import Button from '~shared/button/Button';
import TextInput from '~shared/inputs/TextInput';
import StarRating from '~shared/rating/StarRating';
import { shortenLargeNumbers } from '~shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const ProfileHeader: FC<IProfileHeaderProps> = ({ showHeaderInfo, showEditIcons, sellerProfile, setSellerProfile }): ReactElement => {
  const [showItemEdit, setShowItemEdit] = useState<IShowEditItem>({
    fullName: false,
    oneliner: false
  });

  const [sellerProfileItem, setSellerProfileItem] = useState<ISellerProfileItem>({
    fullName: `${sellerProfile?.fullName}`,
    oneliner: `${sellerProfile?.oneliner}`
  });

  const gridInfo: IGigInfo[] = [
    {
      total: shortenLargeNumbers(sellerProfile?.totalGigs),
      title: 'Total Gigs',
      bgColor: '#50b5ff'
    },
    {
      total: shortenLargeNumbers(sellerProfile?.completedJobs),
      title: 'Completed Orders',
      bgColor: '#f7b124'
    },
    {
      total: shortenLargeNumbers(sellerProfile?.ongoingJobs),
      title: 'Ongoing Orders',
      bgColor: '#8553ee'
    },
    {
      total: shortenLargeNumbers(sellerProfile?.ratingsCount),
      title: 'Ratings & Reviews',
      bgColor: '#ff8b7b'
    }
  ];

  const handleOnChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    console.log({ name, value });
    setSellerProfileItem({ ...sellerProfileItem, [name]: value });
  };

  const handleUpdate = () => {
    if (sellerProfile && setSellerProfile) {
      setSellerProfile({ ...sellerProfile, fullName: sellerProfileItem.fullName, oneliner: sellerProfileItem.oneliner });
    }
  };

  useEffect(() => {
    if (setSellerProfileItem && sellerProfile) {
      setSellerProfileItem({ ...sellerProfile });
    }
  }, [sellerProfile]);

  return (
    <>
      {showHeaderInfo && (
        <div className="relative flex h-56 flex-col gap-x-4 gap-y-3 bg-white px-6 py-4 md:h-52 md:flex-row">
          <div className="flex h-20 w-20 justify-center self-center md:h-24 md:w-24 lg:h-36 lg:w-36">
            <LazyLoadImage
              src={sellerProfile?.profilePicture}
              alt="Gig Image"
              className="w-full h-full rounded-full object-cover"
              placeholderSrc=""
              // effect="blur"
              wrapperClassName="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col md:mt-10 lg:mt-6">
            <div className="flex cursor-pointer self-center md:block md:self-start">
              <div className="flex flex-row self-center text-base font-bold lg:text-2xl">
                {!showItemEdit.fullName && (
                  <>
                    {sellerProfileItem.fullName}
                    {showEditIcons && (
                      <FaPencilAlt
                        onClick={() => {
                          setShowItemEdit((prev: IShowEditItem) => ({ ...prev, fullName: true }));
                        }}
                        className="ml-1 mt-1.5 text-xs md:text-base lg:ml-2.5 lg:mt-2"
                      />
                    )}
                  </>
                )}
              </div>
              {showItemEdit.fullName && (
                <div className="flex gap-x-4">
                  <TextInput
                    className="mt-2 flex h-7 w-full items-center rounded border border-gray-300 p-1.5 text-sm font-normal text-gray-600 focus:border focus:border-sky-500/50 focus:outline-none lg:h-9"
                    placeholder="Fullname"
                    type="text"
                    name="fullName"
                    value={sellerProfileItem.fullName}
                    onChange={handleOnChange}
                  />
                  <div className="my-2 flex">
                    <Button
                      className="md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-2"
                      label="Update"
                      onClick={() => {
                        setShowItemEdit((prev: IShowEditItem) => ({ ...prev, fullName: false }));
                        handleUpdate();
                      }}
                    />
                    &nbsp;&nbsp;
                    <Button
                      className="md:text-md rounded bg-red-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-red-500 focus:outline-none md:py-2"
                      label="Cancel"
                      onClick={() => {
                        setShowItemEdit((prev: IShowEditItem) => ({ ...prev, fullName: false }));
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <span className="flex self-center text-sm md:block md:self-start md:text-base">{sellerProfile?.username}</span>
            <div className="flex cursor-pointer flex-row self-center text-center text-sm md:text-base lg:self-start">
              <div className="flex">
                {!showItemEdit.oneliner && (
                  <>
                    {sellerProfile?.oneliner}
                    {showEditIcons && (
                      <FaPencilAlt onClick={() => setShowItemEdit({ ...showItemEdit, oneliner: true })} className="mx-1 mt-1 lg:ml-2.5" />
                    )}
                  </>
                )}
              </div>

              {showItemEdit.oneliner && (
                <>
                  <div className="flex gap-x-4">
                    <TextInput
                      className="mt-2 flex h-7 w-full items-center rounded border border-gray-300 p-1.5 text-sm font-normal text-gray-600 focus:border focus:border-sky-500/50 focus:outline-none lg:h-9"
                      placeholder="Oneliner"
                      type="text"
                      name="oneliner"
                      value={sellerProfileItem.oneliner}
                      maxLength={70}
                      onChange={handleOnChange}
                    />
                    <div className="my-2 flex">
                      <Button
                        className="md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-2"
                        label="Update"
                        onClick={() => {
                          setShowItemEdit((prev: IShowEditItem) => ({ ...prev, oneliner: false }));
                          handleUpdate();
                        }}
                      />
                      &nbsp;&nbsp;
                      <Button
                        className="md:text-md rounded bg-red-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-red-500 focus:outline-none md:py-2"
                        label="Cancel"
                        onClick={() => {
                          setShowItemEdit((prev: IShowEditItem) => ({ ...prev, oneliner: false }));
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex w-full gap-x-1 self-center">
              <div className="mt-1 w-20 gap-x-2">
                {sellerProfile?.ratingSum && sellerProfile?.ratingsCount ? (
                  <>
                    <StarRating value={sellerProfile.ratingSum / sellerProfile.ratingsCount} size={14} />
                    <div className="ml-2 mt-[3px] flex gap-1 rounded bg-orange-400 px-1 text-xs">
                      <span className="font-bold text-white">{sellerProfile?.ratingSum / sellerProfile?.ratingsCount}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <StarRating value={0} size={14} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 font-bold text-white">
        {gridInfo.map((info: IGigInfo) => (
          <div
            key={uuidv4()}
            style={{ backgroundColor: `${info.bgColor}` }}
            className="col-span-4 flex items-center justify-center p-8 sm:col-span-2 md:col-span-1"
          >
            <div className="flex flex-col">
              <span className="text-center text-base lg:text-xl">{info.total}</span>
              <span className="truncate text-center text-sm lg:text-base">{info.title}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileHeader;
