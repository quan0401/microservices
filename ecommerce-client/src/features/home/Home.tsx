import { FC, ReactElement, useEffect } from 'react';
import HomeSlider from './components/HomeSlider';
import HomeGigsView from './components/HomeGigsView';
import FeatureExperts from './components/FeatureExperts';
import { useGetRandomSellersQuery } from '~features/seller/services/seller.service';
import { ISellerDocument } from '~features/seller/interfaces/seller.interface';
import { useGetGigsByCategoryQuery, useGetTopRatedGigsByCategoryQuery } from '~features/gigs/services/gigs.service';
import { useAppSelector } from '~/store/store';
import { IReduxState } from '~/store/store.interface';
import { ISellerGig } from '~features/gigs/interfaces/gig.interface';
import TopGigsView from '~shared/gigs/TopGigsView';
import { lowerCase } from '~shared/utils/utils.service';

const Home: FC = (): ReactElement => {
  const authUser = useAppSelector((state: IReduxState) => state.authUser);
  const { data, isSuccess } = useGetRandomSellersQuery('10');
  const { data: categoryData, isSuccess: isCategorySuccess } = useGetGigsByCategoryQuery(`${authUser.email}`);
  const { data: topGigsData, isSuccess: isTopGigsSuccess } = useGetTopRatedGigsByCategoryQuery(`${authUser.email}`);
  // const {
  //   data: moreGigsData,
  //   isSuccess: isMoreGigsSuccess,
  //   isLoading: isMoreGigsLoading
  // } = useGetMoreGigsLikeThisQuery(`6547ee5a5c323d4335dfcc0d`);

  let sellers: ISellerDocument[] = [];
  let categoryGigs: ISellerGig[] = [];
  let topGigs: ISellerGig[] = [];

  if (isSuccess) {
    // the reason we dont use useEffect here is that,
    // useGetRandomSellersQuery already uses hook in the background
    sellers = data.sellers as ISellerDocument[];
  }

  if (isCategorySuccess) {
    // the reason we dont use useEffect here is that,
    // useGetRandomSellersQuery already uses hook in the background
    categoryGigs = categoryData?.gigs as ISellerGig[];
  }

  if (isTopGigsSuccess) {
    topGigs = topGigsData.gigs!;
  }

  // TODO: for testing purpose only
  // if (isMoreGigsSuccess) {
  //   topGigs = moreGigsData.gigs!;
  // }
  useEffect(() => {
    // socketService.setupSocketConnection();
  }, []);
  return (
    <div className="m-auto px-6 w-screen relative min-h-screen xl:container md:px-12 lg:px-6">
      <HomeSlider />
      {topGigs.length > 0 && (
        <TopGigsView
          gigs={topGigs}
          title={'Top rated services in: ' + lowerCase(topGigs[0].categories)}
          subTitle={`Highest rated talents for all your ${lowerCase(topGigs[0].categories)}`}
          width={'w-72'}
          type={'home'}
        />
      )}
      {categoryGigs.length > 0 && (
        <HomeGigsView
          gigs={categoryGigs}
          title="Because you viewed a gig on"
          subTitle="Tech subtitle"
          category={categoryGigs[0].categories}
        />
      )}
      <FeatureExperts sellers={sellers} />
    </div>
  );
};

export default Home;
