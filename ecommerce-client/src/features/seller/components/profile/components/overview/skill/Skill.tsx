import { FC, ReactElement, useContext, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import SkillField from './SkillField';
import { SellerContext } from '~features/seller/context/SellerContext';
import { v4 as uuidv4 } from 'uuid';

const Skill: FC = (): ReactElement => {
  const { sellerProfile, setSellerProfile, showEditIcons } = useContext(SellerContext);
  const [showSkillEditForm, setShowSkillEditForm] = useState<boolean>(false);
  const [showSkillAddForm, setShowSkillAddForm] = useState<boolean>(false);
  const [showEditPencil, setShowEditPencil] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');

  return (
    <div className="border-grey mt-6 border bg-white">
      <div className="mb-1 flex justify-between border-b">
        <h4 className="flex py-2.5 pl-3.5 text-sm font-bold text-[#161c2d] md:text-base">SKILLS</h4>
        {showEditIcons && (
          <span
            onClick={() => {
              setShowSkillAddForm(true);
            }}
            className="flex cursor-pointer items-center pr-3.5 text-sm text-[#00698c] md:text-base"
          >
            Add New
          </span>
        )}
      </div>

      {showSkillAddForm && <SkillField type="add" setShowSkillAddForm={setShowSkillAddForm} setShowSkillEditForm={setShowSkillEditForm} />}

      <div className="mb-0 py-1.5">
        <div className="flex min-h-full flex-wrap gap-x-4 gap-y-5 px-2 py-4">
          {sellerProfile.skills.map((skill: string) => (
            <div key={uuidv4()}>
              {!showSkillEditForm && !showSkillAddForm && (
                <div
                  onMouseEnter={() => {
                    setShowEditPencil(skill);
                  }}
                  onMouseLeave={() => {
                    setShowEditPencil('');
                  }}
                  className="relative w-[130px] cursor-pointer truncate rounded-md border bg-[#edeef3] px-3 py-2 text-center"
                >
                  <span className="left-0 top-0 h-full w-full text-sm font-bold text-[#55545b]">{skill}</span>

                  {showEditIcons && showEditPencil === skill && (
                    <span
                      onClick={() => {
                        setShowSkillEditForm(true);
                        setShowEditPencil('');
                        setSelectedSkill(skill);
                      }}
                      className="absolute left-0 top-0 flex h-full w-full cursor-pointer justify-center bg-white px-4 py-3"
                    >
                      <FaPencilAlt className="" size="13" />
                    </span>
                  )}
                </div>
              )}
              {showSkillEditForm && selectedSkill === skill && (
                <SkillField
                  type="edit"
                  setShowSkillAddForm={setShowSkillAddForm}
                  setShowSkillEditForm={setShowSkillEditForm}
                  selectedSkill={skill}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skill;
