import { FC, ReactElement } from 'react';
import GigPackage from './GigViewRight/GigPackage';
import GigSeller from './GigViewRight/GigSeller';
import GigRelatedTags from './GigViewRight/GigRelatedTags';

const GigViewRight: FC = (): ReactElement => {
  return (
    <>
      <GigPackage />
      <GigSeller />
      <GigRelatedTags />
    </>
  );
};

export default GigViewRight;
