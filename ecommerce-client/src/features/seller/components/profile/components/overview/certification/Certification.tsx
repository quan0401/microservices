import { FC, ReactElement, useContext, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import CertificationEditField from './CertificationEditField';
import { SellerContext } from '~features/seller/context/SellerContext';
import { ICertificate } from '~features/seller/interfaces/seller.interface';
import { v4 as uuidv4 } from 'uuid';

const Certification: FC = (): ReactElement => {
  const { sellerProfile, showEditIcons } = useContext(SellerContext);
  const [showCertificateAddForm, setShowCertificateAddForm] = useState<boolean>(false);
  const [showCertificateEditForm, setShowCertificateEditForm] = useState<boolean>(false);
  const [selectedCertificate, setSelectedCertificate] = useState<ICertificate>({
    name: '',
    from: '',
    year: 'Year'
  });
  return (
    <div className="border-grey mt-6 border bg-white">
      <div className="mb-1 flex justify-between border-b">
        <h4 className="flex py-2.5 pl-3.5 text-sm font-bold text-[#161c2d] md:text-base">CERTIFICATIONS</h4>
        {showEditIcons && (
          <span
            onClick={() => {
              setShowCertificateAddForm(true);
            }}
            className="flex cursor-pointer items-center pr-3.5 text-sm text-[#00698c] md:text-base"
          >
            Add New
          </span>
        )}
      </div>
      <ul className="mb-0 list-none pt-1.5">
        {showCertificateAddForm && (
          <li className="flex justify-between">
            <CertificationEditField
              type="add"
              setShowCertificateAddForm={setShowCertificateAddForm}
              setShowCertificateEditForm={setShowCertificateEditForm}
            />
          </li>
        )}

        {!showCertificateAddForm && (
          <>
            {sellerProfile.certificates.length > 0 ? (
              sellerProfile.certificates.map((cer: ICertificate, index: number) => (
                <li key={uuidv4()} className="mb-2 flex justify-between">
                  {!showCertificateEditForm && (
                    <div className="col-span-3 ml-4 flex flex-col pb-3 text-sm md:text-base">
                      <div className="mr-3 font-bold ">{cer.name}</div>
                      <div className="mr-3 font-normal">
                        {cer.from} - {cer.year}
                      </div>
                    </div>
                  )}

                  {showCertificateEditForm &&
                    selectedCertificate.name === cer.name &&
                    selectedCertificate.from === cer.from &&
                    selectedCertificate.year === cer.year && (
                      <CertificationEditField
                        type="edit"
                        setShowCertificateAddForm={setShowCertificateAddForm}
                        setShowCertificateEditForm={setShowCertificateEditForm}
                        selectedCertificate={selectedCertificate}
                      />
                    )}

                  {!showCertificateEditForm && showEditIcons && (
                    <div className="mr-4">
                      <FaPencilAlt
                        onClick={() => {
                          setShowCertificateEditForm(true);
                          setSelectedCertificate(sellerProfile.certificates[index]);
                        }}
                        size="12"
                        className="ml-1 mt-1.5 cursor-pointer lg:ml-2.5 lg:mt-2"
                      />
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="flex justify-between mb-2 ml-4">No information</li>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default Certification;
