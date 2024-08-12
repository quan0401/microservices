import { FC, ReactElement, useContext, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import ExperienceFields from './ExperienceFields';
import { IExperience } from '~features/seller/interfaces/seller.interface';
import { SellerContext } from '~features/seller/context/SellerContext';
import { v4 as uuidv4 } from 'uuid';
import { TimeAgo } from '~shared/utils/timeago.utils';
import { lowerCase, myCompareObjs } from '~shared/utils/utils.service';

const Experience: FC = (): ReactElement => {
  const { sellerProfile, showEditIcons } = useContext(SellerContext);

  const [selectedExperience, setSelectedExperience] = useState<IExperience>({
    company: '',
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    currentlyWorkingHere: false
  });

  const [showExperienceAddForm, setShowExperienceAddForm] = useState<boolean>(false);
  const [showExperienceEditForm, setShowExperienceEditForm] = useState<boolean>(false);

  return (
    <div className="border-grey mt-6 border bg-white">
      <div className="mb-1 flex justify-between border-b">
        <h4 className="flex py-2.5 pl-3.5 text-sm font-bold text-[#161c2d] md:text-base">EXPERIENCE</h4>
        {showEditIcons && (
          <span
            onClick={() => {
              setShowExperienceAddForm(true);
            }}
            className="flex cursor-pointer items-center pr-3.5 text-sm text-[#00698c] md:text-base"
          >
            Add New
          </span>
        )}
      </div>
      <ul className="mb-0 list-none pt-1.5">
        {showExperienceAddForm && (
          <li className="flex justify-between">
            <ExperienceFields
              type="add"
              setShowExperienceAddForm={setShowExperienceAddForm}
              setShowExperienceEditForm={setShowExperienceEditForm}
            />
          </li>
        )}

        {!showExperienceAddForm && (
          <>
            {sellerProfile.experience.map((exp: IExperience, index: number) => (
              <li key={uuidv4()} className="mb-1 flex justify-between">
                {!showExperienceEditForm && (
                  <div className="col-span-3 ml-4 flex flex-col pb-3 text-sm md:text-base">
                    <div className="mr-3 font-bold ">{exp.title}</div>
                    <div className="mr-3 font-normal">{exp.company}</div>
                    <div className="mr-3 font-normal">
                      {TimeAgo.formatDateToMonthAndYear(exp.startDate)} -{' '}
                      {lowerCase('Present') === lowerCase(exp.endDate) ? exp.endDate : TimeAgo.formatDateToMonthAndYear(exp.endDate)}
                    </div>
                  </div>
                )}
                {/* TODO: fix show */}
                {showExperienceEditForm && myCompareObjs(selectedExperience, exp, []) && (
                  <ExperienceFields
                    type="edit"
                    setShowExperienceAddForm={setShowExperienceAddForm}
                    setShowExperienceEditForm={setShowExperienceEditForm}
                    selectedExperience={selectedExperience}
                  />
                )}

                {!showExperienceEditForm && showEditIcons && (
                  <div className="mr-4">
                    <FaPencilAlt
                      onClick={() => {
                        setShowExperienceAddForm(false);
                        setShowExperienceEditForm(true);
                        setSelectedExperience(sellerProfile.experience[index]);
                      }}
                      size="12"
                      className="ml-1 mt-1.5 cursor-pointer lg:ml-2.5 lg:mt-2"
                    />
                  </div>
                )}
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
};

export default Experience;
