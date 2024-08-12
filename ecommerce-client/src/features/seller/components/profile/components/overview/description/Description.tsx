import { cloneDeep } from 'lodash';
import { ChangeEvent, FC, ReactElement, useContext, useEffect, useState } from 'react';
import { SellerContext } from '~features/seller/context/SellerContext';
import Button from '~shared/button/Button';
import TextAreaInput from '~shared/inputs/TextAreaInput';

const Description: FC = (): ReactElement => {
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const { sellerProfile, setSellerProfile, showEditIcons } = useContext(SellerContext);

  const [description, setDescription] = useState<string>(sellerProfile.description || '');

  const onHandleUpdate = () => {
    if (setSellerProfile) {
      const clonedDescription: string = cloneDeep(description);
      setSellerProfile({ ...sellerProfile, description: clonedDescription });
      setShowEditForm(false);
    }
  };

  const handleCancel = () => {
    setDescription(sellerProfile.description || '');
    setShowEditForm(false);
  };

  useEffect(() => {
    setDescription(sellerProfile.description);
  }, [sellerProfile]);

  return (
    <div className="border-grey border bg-white">
      <div className="mb-1 flex justify-between border-b">
        <h4 className="flex py-2.5 pl-3.5 text-sm font-bold text-[#161c2d] md:text-base">DESCRIPTION</h4>
        {showEditIcons && (
          <span
            onClick={() => setShowEditForm(true)}
            className="flex cursor-pointer items-center pr-3.5 text-sm text-[#00698c] md:text-base"
          >
            Edit Description
          </span>
        )}
      </div>
      <div className="mb-0 py-1.5">
        {!showEditForm && <div className="px-3.5 text-sm md:text-base">{description}</div>}
        {showEditForm && (
          <div className="flex w-full flex-col">
            <div className="mb-4 px-3">
              <TextAreaInput
                className="border-grey focus:border-grey block w-full rounded border p-2.5 text-sm text-gray-900 focus:ring-blue-500"
                placeholder="Write description..."
                name="description"
                value={description}
                rows={8}
                maxLength={1000}
                onChange={(event: ChangeEvent) => setDescription((event.target as HTMLInputElement).value)}
              />
            </div>
            <div className="mx-3 mb-2 flex cursor-pointer justify-start">
              <Button
                disabled={!description || description === sellerProfile.description}
                className={`md:text-md rounded
            ${!description || description === sellerProfile.description ? 'cursor-not-allowed opacity-40' : 'hover:bg-sky-400'}
             px-6 py-1 text-center text-sm bg-sky-500 font-bold text-white  focus:outline-none md:py-2`}
                label="Update"
                onClick={onHandleUpdate}
              />
              &nbsp;&nbsp;
              <Button
                className="md:text-md rounded bg-gray-300 px-6 py-1 text-center text-sm font-bold hover:bg-gray-200 focus:outline-none md:py-2"
                label="Cancel"
                onClick={handleCancel}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Description;
