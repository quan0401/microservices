import { FC, FormEvent, ReactElement, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/store/store';
import { IReduxState } from '~/store/store.interface';
import Breadcrumb from '~shared/breadcrumb/Breadcrumb';
import PersonalInfo from './components/PersonalInfo';
import {
  ICertificate,
  IEducation,
  IExperience,
  ILanguage,
  IPersonalInfoData,
  ISellerDocument
} from '~features/seller/interfaces/seller.interface';
import SellerExperienceFields from './components/SellerExperienceFields';
import SellerEducationFields from './components/SellerEducationFields';
import SellerSocialLinksFields from './components/SellerSocialLinksfields';
import SellerSkillField from './components/SellerSkillField';
import SellerLanguageFields from './components/SellerLanguagesFields';
import SellerCertificateFields from './components/SellerCertificateFields';
import { useSellerScheme } from '~features/seller/hooks/userSellerScheme';
import Button from '~shared/button/Button';
import { filter, lowerCase } from 'lodash';
import { useCreateSellerMutation } from '~features/seller/services/seller.service';
import { IBuyerDocument } from '~features/buyer/interfaces/buyer.interface';
import { IResponse } from '~shared/shared.interface';
import { useNavigate } from 'react-router-dom';
import { addSeller } from '~features/seller/reducers/seller.reducer';
import { addBuyer } from '~features/buyer/reducers/buyer.reducer';
import { deleteFromLocalStorage } from '~shared/utils/utils.service';

const AddSeller: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const buyer = useAppSelector((state: IReduxState) => state.buyer);
  const [personalInfo, setPersonalInfo] = useState<IPersonalInfoData>({
    fullName: '',
    profilePicture: `${authUser.profilePicture}`,
    description: '',
    responseTime: '',
    oneliner: ''
  });

  const [experienceFields, setExperienceFields] = useState<IExperience[]>([
    {
      company: '',
      title: '',
      startDate: 'Start date',
      endDate: 'End date',
      description: '',
      currentlyWorkingHere: false
    }
  ]);

  const [educationFields, setEducationFields] = useState<IEducation[]>([
    {
      country: 'Country',
      university: '',
      title: 'Title',
      major: '',
      year: 'Year'
    }
  ]);
  const [socialFields, setSocialFields] = useState<string[]>(['']);
  const [skillsFields, setSkillsFields] = useState<string[]>([
    // ''
    'skillfield'
  ]);
  const [languageFields, setLanguageFields] = useState<ILanguage[]>([
    {
      language: '',
      level: 'Level'
    }
  ]);
  const [certificateFields, setCertificateFields] = useState<ICertificate[]>([
    {
      name: '',
      from: '',
      year: 'Year'
    }
  ]);
  const [schemaValidation, personalInfoErrors, experienceErrors, educationErrors, skillsErrors, languagesErrors] = useSellerScheme({
    personalInfo,
    experienceFields,
    educationFields,
    skillsFields,
    languageFields
  });
  const errors = [...personalInfoErrors, ...experienceErrors, ...educationErrors, ...skillsErrors, ...languagesErrors];

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [createSeller, { isLoading }] = useCreateSellerMutation();

  const onCreateSeller = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const isValid: boolean = await schemaValidation();

      if (isValid) {
        const skills: string[] = filter(skillsFields, (skill: string) => skill !== '') as string[];
        const socialLinks: string[] = filter(socialFields, (link: string) => link !== '') as string[];
        const certificates: ICertificate[] = filter(
          certificateFields,
          (item: ICertificate) => item.name !== '' && item.from !== '' && item.year !== ''
        ) as ICertificate[];

        const sellerData: ISellerDocument = {
          email: `${authUser.email}`,
          profilePublicId: `${authUser.profilePublicId}`,
          profilePicture: `${authUser.profilePicture}`,
          fullName: personalInfo.fullName,
          description: personalInfo.description,
          country: `${authUser.country}`,
          skills,
          oneliner: personalInfo.oneliner,
          languages: languageFields,
          responseTime: parseInt(personalInfo.responseTime, 10),
          experience: experienceFields,
          education: educationFields,
          socialLinks,
          certificates
        };
        const updateBuyer: IBuyerDocument = { ...buyer, isSeller: true };
        const response: IResponse = await createSeller(sellerData).unwrap();
        dispatch(addSeller(response.seller));
        dispatch(addBuyer(updateBuyer));
        navigate(`/seller_profile/${lowerCase(`${authUser.username}`)}/${response.seller?._id}/edit`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (buyer.isSeller) {
      navigate('/');
    }
    return () => {
      deleteFromLocalStorage('becomeASeller');
    };
  }, [buyer]);

  return (
    <div className="relative w-full">
      {/* <!-- add breadcrumb component here --> */}
      <Breadcrumb breadCrumbItems={['Seller', 'Create Profile']} />

      <div className="container relative mx-auto my-5 px-2 pb-12 md:px-0">
        {/* <!-- add circular loader here --> */}
        {/* <div className="absolute left-0 top-0 z-50 flex h-full w-full justify-center bg-white/[0.8] text-sm font-bold md:text-base lg:text-xl"> */}
        {authUser && !authUser.emailVerified && (
          <div className="absolute left-0 top-0 z-50 flex h-full w-full justify-center bg-white/[0.8] text-sm font-bold md:text-base lg:text-xl">
            <span className="mt-20">Please verify your email.</span>
          </div>
        )}

        <div className="left-0 top-0 z-10 mt-4 block h-full bg-white">
          <PersonalInfo personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} personalInfoErrors={personalInfoErrors} />
          <SellerExperienceFields
            experienceFields={experienceFields}
            setExperienceFields={setExperienceFields}
            experienceErrors={experienceErrors}
          />
          <SellerEducationFields
            educationFields={educationFields}
            setEducationFields={setEducationFields}
            educationErrors={educationErrors}
          />
          <SellerSkillField skillsFields={skillsFields} setSkillsFields={setSkillsFields} skillsErrors={skillsErrors} />
          <SellerLanguageFields languageFields={languageFields} setLanguageFields={setLanguageFields} languagesErrors={languagesErrors} />
          <SellerCertificateFields certificatesFields={certificateFields} setCertificatesFields={setCertificateFields} />
          <SellerSocialLinksFields socialFields={socialFields} setSocialFields={setSocialFields} />
          <div className="flex justify-end p-6">
            <Button
              onClick={onCreateSeller}
              className="rounded flex items-center bg-yellow-600 px-4 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-2 md:text-base"
              label="Create Profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSeller;
