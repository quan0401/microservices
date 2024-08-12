import { FC, ReactElement } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { IEducationEditProps } from '~features/seller/interfaces/seller.interface';

const Education: FC<IEducationEditProps> = (): ReactElement => {
  return (
    <div className="border-grey mt-6 border bg-white">
      <div className="mb-1 flex justify-between border-b">
        <h4 className="flex py-2.5 pl-3.5 text-sm font-bold text-[#161c2d] md:text-base">EDUCATION</h4>
        <span className="flex cursor-pointer items-center pr-3.5 text-sm text-[#00698c] md:text-base">Add New</span>
      </div>
      <ul className="mb-0 list-none pt-1.5">
        <li className="flex justify-between">{/* <!-- EducationFields --> */}</li>
        <li className="mb-1 flex justify-between">
          <div className="col-span-3 ml-4 flex flex-col pb-3 text-sm md:text-base">
            <div className="mr-3 pb-2 font-bold">Major Title</div>
            <div className="mr-3 font-normal">university, country, Graduated year</div>
          </div>
          {/* <!-- EducationFields --> */}
          <div className="mr-4">
            <FaPencilAlt size="12" className="ml-1 mt-1.5 cursor-pointer lg:ml-2.5 lg:mt-2" />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Education;
