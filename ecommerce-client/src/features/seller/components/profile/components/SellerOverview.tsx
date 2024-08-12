import { FC, lazy, ReactElement } from 'react';
import { SellerContext } from '~features/seller/context/SellerContext';
import { IProfileHeaderProps, ISellerDocument } from '~features/seller/interfaces/seller.interface';

const Language = lazy(() => import('./overview/language/Language'));
const AboutMe = lazy(() => import('./overview/aboutme/AboutMe'));
const SocialLink = lazy(() => import('./overview/socialLink/SocialLink'));
const Certification = lazy(() => import('./overview/certification/Certification'));
const Description = lazy(() => import('./overview/description/Description'));
const Experience = lazy(() => import('./overview/experience/Experience'));
const Skill = lazy(() => import('./overview/skill/Skill'));

const SellerOverview: FC<IProfileHeaderProps> = ({ showHeaderInfo, showEditIcons, sellerProfile, setSellerProfile }): ReactElement => {
  return (
    <SellerContext.Provider value={{ showEditIcons, setSellerProfile, sellerProfile: sellerProfile as ISellerDocument }}>
      <div className="w-full lg:w-1/3">
        <Language />
        <AboutMe />
        <SocialLink />
        <Certification />
      </div>
      <div className="w-full pl-4 lg:w-2/3">
        <Description />
        <Experience />
        <Skill />
      </div>
    </SellerContext.Provider>
  );
};

export default SellerOverview;
