import { FC, ReactElement, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GigContext } from '~features/gigs/context/GigContext';

const GigLeftAbout: FC = (): ReactElement => {
  const { gig } = useContext(GigContext);
  return (
    <>
      <div className="font-semibold text-lg mt-10 pb-6">About This Gig</div>
      <div className="pb-6">
        {/* <HtmlParser input={gig.description} /> */}
        {gig.description}
      </div>
      <hr className="border-grey my-3" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4">
        <div className="flex flex-col">
          <span className="text-[#95979d]">Main Categories</span>
          <span className="font-normal">{gig.categories}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#95979d]">
            {gig?.subCategories &&
              gig.subCategories.map((cat: string, index: number) => (
                <span className="font-normal" key={uuidv4()}>
                  {`${cat}${index !== gig.subCategories.length - 1 ? ',' : '.'}`}&nbsp;
                </span>
              ))}
          </span>
          <div className="flex flex-col">
            <span className="font-normal">category</span>
          </div>
        </div>
      </div>
      <hr className="border-grey my-3" />
    </>
  );
};

export default GigLeftAbout;
