import { cloneDeep } from 'lodash';
import { ChangeEvent, FC, ReactElement, useContext, useState } from 'react';
import { SellerContext } from '~features/seller/context/SellerContext';
import { ISocialEditLinksProps } from '~features/seller/interfaces/seller.interface';
import Button from '~shared/button/Button';
import TextInput from '~shared/inputs/TextInput';

const SocialLinkField: FC<ISocialEditLinksProps> = ({
  type,
  selectedLink,
  setShowSocialLinksAddForm,
  setShowSocialLinksEditForm
}): ReactElement => {
  const { sellerProfile, setSellerProfile } = useContext(SellerContext);
  const [socialLink, setSocialLink] = useState<string>(selectedLink || '');

  const onHandleUpdate = () => {
    const clonedSocialLinks: string[] = cloneDeep(sellerProfile.socialLinks);

    if (type === 'add') {
      clonedSocialLinks.push(socialLink);
    } else {
      const idx: number = clonedSocialLinks.indexOf(`${selectedLink}`);
      clonedSocialLinks.splice(idx, 1, `${socialLink}`);
    }

    if (setShowSocialLinksAddForm && setShowSocialLinksEditForm) {
      setShowSocialLinksAddForm(false);
      setShowSocialLinksEditForm(false);
      if (setSellerProfile) {
        setSellerProfile({ ...sellerProfile, socialLinks: clonedSocialLinks });
      }
    }
  };

  const onHandleCancel = () => {
    setSocialLink('');
    if (setShowSocialLinksEditForm && setShowSocialLinksAddForm) {
      setShowSocialLinksEditForm(false);
      setShowSocialLinksAddForm(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-6 px-3">
        <TextInput
          className="border-grey w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
          placeholder="Social media link"
          type="text"
          name="socialLink"
          value={socialLink}
          onChange={(e: ChangeEvent) => {
            setSocialLink((e.target as HTMLInputElement).value);
          }}
        />
      </div>
      <div className="z-20 my-4 mt-10 flex cursor-pointer justify-center md:z-0 md:mt-0">
        <Button
          disabled={!socialLink}
          className={`md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white
          ${socialLink ? 'hover:bg-sky-400' : 'cursor-not-allowed opacity-40 '}
          focus:outline-none md:py-2`}
          label={type === 'add' ? 'Add' : 'Update'}
          onClick={onHandleUpdate}
        />
        &nbsp;&nbsp;
        <Button
          className="md:text-md rounded bg-gray-300 px-6 py-1 text-center text-sm font-bold hover:bg-gray-200 focus:outline-none md:py-2"
          label="Cancel"
          onClick={onHandleCancel}
        />
      </div>
    </div>
  );
};

export default SocialLinkField;
