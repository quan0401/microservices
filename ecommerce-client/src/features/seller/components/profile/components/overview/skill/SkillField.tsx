import { cloneDeep } from 'lodash';
import { ChangeEvent, FC, ReactElement, useContext, useState } from 'react';
import { SellerContext } from '~features/seller/context/SellerContext';
import { ISkillEditProps } from '~features/seller/interfaces/seller.interface';
import Button from '~shared/button/Button';
import TextInput from '~shared/inputs/TextInput';

const SkillField: FC<ISkillEditProps> = ({ type, selectedSkill, setShowSkillEditForm, setShowSkillAddForm }): ReactElement => {
  const { sellerProfile, setSellerProfile } = useContext(SellerContext);
  const [skill, setSkill] = useState<string>(selectedSkill ?? '');

  const onHandleUpdate = () => {
    const clonedSkills = cloneDeep(sellerProfile.skills);
    if (type === 'add') {
      clonedSkills.push(skill);
    } else {
      const foundIndex: number = clonedSkills.indexOf(`${selectedSkill}`);
      clonedSkills.splice(foundIndex, 1, skill);
    }

    if (setSellerProfile) {
      setSellerProfile({ ...sellerProfile, skills: clonedSkills });
    }
    if (setShowSkillAddForm && setShowSkillEditForm) {
      setShowSkillAddForm(false);
      setShowSkillEditForm(false);
    }
  };

  const onHandleCancel = () => {
    if (setShowSkillAddForm && setShowSkillEditForm) {
      setShowSkillAddForm(false);
      setShowSkillEditForm(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-6 px-3">
        <TextInput
          className="border-grey w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
          placeholder="Skill E.g: Front End Developer"
          type="text"
          name="skill"
          value={skill}
          onChange={(e: ChangeEvent) => {
            setSkill((e.target as HTMLInputElement).value);
          }}
        />
      </div>
      <div className="z-20 mx-3 my-2 flex cursor-pointer justify-start md:z-0 md:mt-0">
        <Button
          disabled={!skill || selectedSkill === skill}
          className={`md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white
          ${!skill || selectedSkill === skill ? 'opacity-40 cursor-not-allowed' : 'hover:bg-sky-400'}
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

export default SkillField;
