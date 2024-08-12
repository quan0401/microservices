import { FC, lazy, LazyExoticComponent, ReactElement, Suspense, useEffect } from 'react';

import { IHeader } from '~shared/header/interfaces/header.interface';

import Categories from './Categories';
import HowItWorks from './HowItWorks';
import CircularPageLoader from '~shared/page-loader/CircularPageLoader';
import { saveToSessionStorage } from '~shared/utils/utils.service';

const IndexHeader: LazyExoticComponent<FC<IHeader>> = lazy(() => import('~shared/header/components/Header'));
const IndexHero: LazyExoticComponent<FC> = lazy(() => import('./Hero'));
const IndexGigTabs: LazyExoticComponent<FC> = lazy(() => import('./gig-tabs/GigTabs'));

// import IndexHeader from '~shared/header/components/Header';
// import IndexHero from './Hero';
// import IndexGigTabs from './gig-tabs/GigTabs';

const Index: FC = (): ReactElement => {
  useEffect(() => {
    saveToSessionStorage(JSON.stringify(false), JSON.stringify(''));
  }, []);
  return (
    <div>
      <Suspense fallback={<CircularPageLoader />}>
        <IndexHeader navClass="navbar peer-checked:navbar-active fixed z-20 w-full border-b border-gray-100 bg-white/90 shadow-2xl shadow-gray-600/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none" />
        <IndexHero />
        <IndexGigTabs />
        <HowItWorks />
        <Categories />
      </Suspense>
    </div>
  );
};

export default Index;
