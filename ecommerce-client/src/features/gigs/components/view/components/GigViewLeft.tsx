import { FC, ReactElement } from 'react';
import GigLeftOverview from './GigViewLeft/GigLeftOverview';
import GigLeftAbout from './GigViewLeft/GigLeftAbout';
import GigViewReviews from './GigViewLeft/GigViewReviews';

const GigViewLeft: FC = (): ReactElement => {
  return (
    <>
      <GigLeftOverview />
      <GigLeftAbout />
      <GigViewReviews showRatings={true} hasFetchedReviews={false} type="ofGig" />
    </>
  );
};

export default GigViewLeft;
