import { ChangeEvent, FC, ReactElement } from 'react';
import { IEducation, IEducationProps } from '~features/seller/interfaces/seller.interface';
import Button from '~shared/button/Button';
import Dropdown from '~shared/dropdown/Dropdown';
import TextInput from '~shared/inputs/TextInput';
import { countriesList, degreeList, yearList } from '~shared/utils/utils.service';

const SellerEducationFields: FC<IEducationProps> = ({ educationFields, setEducationFields }): ReactElement => {
  const handleEducationFieldsChange = (e: ChangeEvent, index: number) => {
    if (educationFields && setEducationFields) {
      const target: HTMLInputElement = e.target as HTMLInputElement;
      const { value, type, checked, name } = target;
      setEducationFields((prev: IEducation[]): IEducation[] => {
        const newFields: IEducation[] = [...prev];
        newFields[index][name] = value;
        return newFields;
      });
    }
  };

  const handleAddMore = () => {
    const newEducationFields: IEducation = {
      country: 'Country',
      university: '',
      title: 'Title',
      major: '',
      year: 'Year'
    };
    if (setEducationFields) {
      setEducationFields((prev) => [...prev, newEducationFields]);
    }
  };
  const handleDelete = (index: number) => {
    if (setEducationFields) {
      setEducationFields((prev: IEducation[]): IEducation[] => {
        const data: IEducation[] = [...prev];
        if (prev.length > 1) {
          data.splice(index, 1);
        } else {
          return prev;
        }
        return [...data];
      });
    }
  };

  return (
    <div className="border-grey flex w-full flex-col border-b px-6 pb-3 pt-6">
      <div className="flex justify-between">
        <h2 className="pb-4 text-xl font-bold">Education</h2>
        <Button
          className="flex items-center md:text-md h-7 rounded bg-sky-500 px-6 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:px-8"
          label="Add More"
          onClick={handleAddMore}
        />
      </div>
      {educationFields?.map((input: IEducation, index: number) => (
        <div key={`educationFields_${index}`}>
          <div className="relative">
            <TextInput
              onChange={(e) => handleEducationFieldsChange(e, index)}
              className="border-grey mb-4 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
              placeholder="University/College Name"
              type="text"
              name="university"
              value={input.university}
            />
          </div>
          <div className="relative h-[55px]">
            <Dropdown
              text={input.country}
              maxHeight="300"
              mainClassNames="absolute bg-white z-40"
              showSearchInput
              values={countriesList()}
              onClick={(item: string) => {
                if (setEducationFields) {
                  setEducationFields((prev: IEducation[]): IEducation[] => {
                    const newFields: IEducation[] = [...prev];
                    newFields[index]['country'] = item;
                    return newFields;
                  });
                }
              }}
            />
          </div>
          <div className="mt-4 grid h-1/5 grid-cols-4 gap-x-2 gap-y-3">
            <div className="relative">
              <Dropdown
                text={input.title}
                maxHeight="300"
                showSearchInput
                mainClassNames="absolute bg-white z-30"
                values={degreeList()}
                onClick={(item: string) => {
                  if (setEducationFields) {
                    setEducationFields((prev: IEducation[]): IEducation[] => {
                      const newFields: IEducation[] = [...prev];
                      newFields[index]['title'] = item;
                      return newFields;
                    });
                  }
                }}
              />
            </div>
            <div className="col-span-2">
              <TextInput
                onChange={(e) => handleEducationFieldsChange(e, index)}
                className="border-grey w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
                placeholder="Major e.g: Computer Engineering"
                type="text"
                name="major"
                value={input.major}
              />
            </div>
            <div className="relative">
              <Dropdown
                text={input.year}
                maxHeight="300"
                showSearchInput
                mainClassNames="absolute bg-white z-30"
                values={yearList(10)}
                onClick={(item: string) => {
                  if (setEducationFields) {
                    setEducationFields((prev: IEducation[]): IEducation[] => {
                      const newFields: IEducation[] = [...prev];
                      newFields[index]['year'] = item;
                      return newFields;
                    });
                  }
                }}
              />
            </div>
            <div className="mb-2">
              {educationFields.length > 1 && (
                <Button
                  className="flex items-center md:text-md h-7 rounded bg-red-500 px-6 text-center text-sm font-bold text-white hover:bg-red-400 focus:outline-none md:px-8"
                  label="Delete"
                  onClick={() => handleDelete(index)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerEducationFields;
