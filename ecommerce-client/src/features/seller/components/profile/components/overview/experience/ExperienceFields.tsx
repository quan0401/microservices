import { cloneDeep } from 'lodash';
import { ChangeEvent, FC, ReactElement, useContext, useState, lazy, useEffect } from 'react';
import isEqual from 'react-fast-compare';
import { SellerContext } from '~features/seller/context/SellerContext';
import { IExperience, IExperienceEditProps } from '~features/seller/interfaces/seller.interface';
import Button from '~shared/button/Button';
import Dropdown from '~shared/dropdown/Dropdown';
import TextAreaInput from '~shared/inputs/TextAreaInput';
import TextInput from '~shared/inputs/TextInput';
import { isEmptyObj, monthList, yearList } from '~shared/utils/utils.service';

const initValue: IExperience = {
  company: '',
  title: '',
  startDate: '',
  endDate: '',
  description: '',
  currentlyWorkingHere: false
};

const ExperienceFields: FC<IExperienceEditProps> = ({
  type,
  selectedExperience,
  setShowExperienceAddForm,
  setShowExperienceEditForm
}): ReactElement => {
  const { sellerProfile, setSellerProfile } = useContext(SellerContext);
  const [experience, setExperience] = useState<IExperience>(selectedExperience?.title ? selectedExperience : initValue);
  const [startMonth, setStartMonth] = useState<string>(
    selectedExperience?.startDate ? monthList()[new Date(selectedExperience.startDate).getMonth()] : ''
  );
  const [startYear, setStartYear] = useState<string>(
    selectedExperience?.startDate ? new Date(selectedExperience?.startDate).getFullYear().toString() : ''
  );
  const [endMonth, setEndMonth] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [activeDropdown, setActiveDropdown] = useState<'start' | 'end'>('start');

  const handleOnChange = (e: ChangeEvent): void => {
    const target = e.target as HTMLInputElement;
    const { name, value, checked, type } = target;

    setExperience((prev: IExperience): IExperience => {
      const result: IExperience = { ...prev };
      if (type === 'checkbox') {
        result[name] = checked;
        result.endDate = 'Present';
      } else {
        result[name] = value;
      }
      return { ...result };
    });
  };

  const updateStartDate = (selectedMonth: string, selectedYear: string) => {
    if (selectedMonth && selectedYear) {
      const date = new Date();
      date.setMonth(monthList().indexOf(selectedMonth));
      date.setFullYear(parseInt(selectedYear, 10));
      setExperience((prev: IExperience) => ({
        ...prev,
        startDate: date.toISOString()
      }));
    }
  };

  const updateEndDate = (selectedMonth: string, selectedYear: string) => {
    if (selectedMonth && selectedYear) {
      const date = new Date();
      date.setMonth(monthList().indexOf(selectedMonth));
      date.setFullYear(parseInt(selectedYear, 10));
      setExperience((prev: IExperience) => ({
        ...prev,
        endDate: date.toISOString()
      }));
    }
  };

  const onHandleUpdate = () => {
    const clonedExperiences: IExperience[] = cloneDeep(sellerProfile.experience);
    if (type === 'add') {
      clonedExperiences.push(experience);
    } else {
      const foundIndex: number = clonedExperiences.findIndex((exp: IExperience) => isEqual(exp, selectedExperience as IExperience));
      clonedExperiences.splice(foundIndex, 1, experience);
    }

    if (setShowExperienceAddForm && setShowExperienceEditForm && setSellerProfile) {
      setShowExperienceAddForm(false);
      setShowExperienceEditForm(false);
      setSellerProfile({ ...sellerProfile, experience: clonedExperiences });
    }
  };

  const onHandleCancel = () => {
    if (setShowExperienceAddForm && setShowExperienceEditForm && setSellerProfile) {
      setShowExperienceAddForm(false);
      setShowExperienceEditForm(false);
      setSellerProfile({ ...sellerProfile });
    }
  };

  useEffect(() => {
    if (startYear && startMonth && endMonth && endYear) {
      const checkValidDate = () => {
        const startDateValue = parseInt(startYear, 10) * 12 + monthList().indexOf(startMonth) + 1;
        const endDateValue = parseInt(endYear, 10) * 12 + monthList().indexOf(endMonth) + 1;
        return endDateValue > startDateValue;
      };
      const res = checkValidDate();
      console.log(res);
    }
  }, [startYear, startMonth, endMonth, endYear]);

  return (
    <div className="flex w-full flex-col">
      <div className="px-3">
        <TextInput
          className="border-grey mb-4 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
          placeholder="Title (E.g: CEO)"
          type="text"
          name="title"
          value={experience.title}
          onChange={handleOnChange}
        />
        <TextInput
          onChange={handleOnChange}
          className="border-grey mb-4 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
          placeholder="Company name"
          type="text"
          name="company"
          value={experience.company}
        />
        <h4 className="flex py-1 text-sm font-bold text-[#161c2d] md:text-base">Start Date</h4>
        <div className="grid  grid-cols-2 gap-x-2 gap-y-3">
          <div className="relative">
            <Dropdown
              text={startMonth || 'Month'}
              maxHeight="300"
              mainClassNames="absolute bg-white z-50"
              showSearchInput
              values={monthList()}
              onClick={(item: string) => {
                setStartMonth(item);
                updateStartDate(item, startYear);
              }}
              onFocus={() => {
                setActiveDropdown('start');
              }}
            />
          </div>
          <div className="relative">
            <Dropdown
              text={startYear || 'Year'}
              maxHeight="300"
              mainClassNames="absolute bg-white z-50"
              showSearchInput
              values={yearList(100)}
              onClick={(item: string) => {
                setStartYear(item);
                updateStartDate(startMonth, item);
              }}
              onFocus={() => {
                setActiveDropdown('start');
              }}
            />
          </div>
        </div>
        <h4 className="flex mt-16 pb-1 text-sm font-bold text-[#161c2d] md:text-base">End Date</h4>
        {experience.currentlyWorkingHere !== true && (
          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            <div className="relative">
              <Dropdown
                text={endMonth || 'Month'}
                maxHeight="300"
                mainClassNames={`absolute bg-white ${activeDropdown === 'start' ? '' : 'z-50'}`}
                showSearchInput
                values={monthList()}
                onClick={(item: string) => {
                  setEndMonth(item);
                  updateEndDate(item, endYear);
                }}
                onFocus={() => {
                  setActiveDropdown('end');
                }}
              />
            </div>
            <div className="relative">
              <Dropdown
                text={endYear || 'Year'}
                maxHeight="300"
                mainClassNames={`absolute bg-white ${activeDropdown === 'start' ? '' : 'z-50'}`}
                showSearchInput
                values={startYear ? yearList(new Date().getFullYear() - parseInt(startYear, 10)) : yearList(100)}
                onClick={(item: string) => {
                  setEndYear(item);
                  updateEndDate(endMonth, item);
                }}
                onFocus={() => {
                  setActiveDropdown('end');
                }}
              />
            </div>
          </div>
        )}

        <div className="mb-4 mt-16 flex items-center">
          <TextInput
            onChange={handleOnChange}
            id="default-checkbox"
            type="checkbox"
            name="currentlyWorkingHere"
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600"
            checked={experience.currentlyWorkingHere}
          />
          <label htmlFor="default-checkbox" className="ml-2 text-sm font-normal">
            I am currently working here
          </label>
        </div>
        <div className="mb-5 flex items-center">
          <TextAreaInput
            onChange={handleOnChange}
            className="border-grey focus:border-grey block w-full rounded border p-2.5 text-sm text-gray-900 focus:ring-blue-500"
            placeholder="Write description..."
            name="description"
            value={experience.description}
            rows={5}
          />
        </div>
      </div>
      <div className="z-20 mx-3 my-2 flex cursor-pointer justify-start md:z-0">
        <Button
          disabled={isEmptyObj(experience) || isEqual(experience, selectedExperience)}
          className={`md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white
          ${isEmptyObj(experience) || isEqual(experience, selectedExperience) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-sky-400'}
           focus:outline-none md:py-2`}
          label={type === 'add' ? 'Add' : 'Update'}
          onClick={onHandleUpdate}
        />
        &nbsp;&nbsp;
        <Button
          className="md:text-md rounded bg-gray-300 px-6 py-1 text-center text-sm font-bold hover:bg-gray-200 focus:outline-none md:py-2"
          label="Cancel"
          onClick={onHandleCancel}
        />
      </div>
    </div>
  );
};

export default ExperienceFields;
