import { FC, ReactElement } from 'react';
import Button from '~shared/button/Button';
import Dropdown from '~shared/dropdown/Dropdown';
import TextInput from '~shared/inputs/TextInput';

const EducationField: FC = (): ReactElement => {
  return (
    <div className="flex w-full flex-col">
      <div className="mb-4 px-3">
        <div className="relative">
          <TextInput
            className="border-grey mb-4 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
            placeholder="University/College Name"
            type="text"
            name="university"
            value=""
          />
        </div>
        <div className="relative h-[55px]">
          <Dropdown
            text=""
            maxHeight="300"
            showSearchInput={true}
            mainClassNames="absolute bg-white z-50"
            values={[]}
            setValue={() => {}}
          />
        </div>
        <div className="mt-4 grid h-1/5 grid-cols-4 gap-x-2 gap-y-3">
          <div className="relative">
            <Dropdown text="" maxHeight="300" mainClassNames="absolute bg-white z-30" values={[]} setValue={() => {}} />
          </div>
          <div className="col-span-2">
            <TextInput
              className="border-grey mb-4 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
              placeholder="Major e.g: Computer Engineering"
              type="text"
              name="major"
              value=""
            />
          </div>
          <div className="relative">
            <Dropdown text="" maxHeight="300" mainClassNames="absolute bg-white z-30" values={[]} setValue={() => {}} />
          </div>
        </div>
      </div>
      <div className="mx-3 my-4 flex cursor-pointer justify-start md:z-0 md:mt-0">
        <Button disabled={false} label="Add" />
        &nbsp;&nbsp;
        <Button
          className="md:text-md rounded bg-gray-300 px-6 py-1 text-center text-sm font-bold hover:bg-gray-200 focus:outline-none md:py-2"
          label="Cancel"
        />
      </div>
    </div>
  );
};

export default EducationField;
