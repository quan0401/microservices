import { cloneDeep, set } from 'lodash';
import { ChangeEvent, Dispatch, FC, ReactElement, SetStateAction, useContext, useState } from 'react';
import isEqual from 'react-fast-compare';
import { SellerContext } from '~features/seller/context/SellerContext';
import { ICertificate, ICertificateEditProps } from '~features/seller/interfaces/seller.interface';
import Button from '~shared/button/Button';
import Dropdown from '~shared/dropdown/Dropdown';
import TextInput from '~shared/inputs/TextInput';
import { yearList } from '~shared/utils/utils.service';

const CertificationEditField: FC<ICertificateEditProps> = ({
  type,
  selectedCertificate,
  setShowCertificateAddForm,
  setShowCertificateEditForm
}): ReactElement => {
  const [certificate, setCertificate] = useState<ICertificate>(
    selectedCertificate?.name
      ? selectedCertificate
      : {
          name: '',
          from: '',
          year: 'Year'
        }
  );
  const { sellerProfile, setSellerProfile } = useContext(SellerContext);

  const handleOnChange = (e: ChangeEvent): void => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setCertificate({ ...certificate, [name]: value });
  };

  const handleDropdownValue = (item: string) => {
    setCertificate({
      ...certificate,
      year: item
    });
  };

  const onHandleUpdate = () => {
    const cloneCertificates: ICertificate[] = cloneDeep(sellerProfile.certificates);
    if (type === 'add') {
      cloneCertificates.push(certificate);
    } else {
      const foundIndex = cloneCertificates.findIndex((cer: ICertificate) => isEqual(cer, selectedCertificate));
      cloneCertificates.splice(foundIndex, 1, certificate);
    }

    if (sellerProfile && setSellerProfile) {
      setSellerProfile({
        ...sellerProfile,
        certificates: cloneCertificates
      });
    }
    if (setShowCertificateAddForm && setShowCertificateEditForm) {
      setShowCertificateAddForm(false);
      setShowCertificateEditForm(false);
    }
  };

  const onHandleCancel = () => {
    if (setSellerProfile && sellerProfile) setSellerProfile({ ...sellerProfile });
    if (setShowCertificateAddForm && setShowCertificateEditForm) {
      setShowCertificateAddForm(false);
      setShowCertificateEditForm(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-16 px-3">
        <TextInput
          className="border-grey mb-4 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
          placeholder="Certificate or Award"
          type="text"
          name="name"
          value={certificate.name}
          onChange={(e: ChangeEvent) => handleOnChange(e)}
        />
        <TextInput
          className="border-grey mb-4 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
          placeholder="Certificate From (e.g: Google)"
          type="text"
          name="from"
          value={certificate.from}
          onChange={(e: ChangeEvent) => handleOnChange(e)}
        />
        <div className="relative">
          <Dropdown
            text={`${certificate.year}`}
            setValue={handleDropdownValue as Dispatch<SetStateAction<string>>}
            maxHeight="300"
            mainClassNames="absolute bg-white z-50"
            values={yearList(100)}
            showSearchInput
          />
        </div>
      </div>
      <div className="z-20 my-4 mt-10 flex cursor-pointer justify-center md:z-0 md:mt-0">
        <Button
          disabled={!certificate.name || !certificate.from || certificate.year === 'Year'}
          // className="md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-2"
          className={`md:text-md rounded
            ${!certificate.name || !certificate.from || certificate.year === 'Year' ? 'cursor-not-allowed opacity-40' : 'hover:bg-sky-400'}
             px-6 py-1 text-center text-sm bg-sky-500 font-bold text-white  focus:outline-none md:py-2`}
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

export default CertificationEditField;
