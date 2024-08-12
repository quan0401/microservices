import { cloneDeep, filter, findIndex, isEmpty } from 'lodash';
import { ChangeEvent, FC, ReactElement, SetStateAction, Dispatch, useContext, useState } from 'react';
import { SellerContext } from '~features/seller/context/SellerContext';
import { ILanguage, ILanguageEditFieldsProps } from '~features/seller/interfaces/seller.interface';
import Button from '~shared/button/Button';
import Dropdown from '~shared/dropdown/Dropdown';
import TextInput from '~shared/inputs/TextInput';
import { languageLevel } from '~shared/utils/utils.service';

const LanguageFields: FC<ILanguageEditFieldsProps> = ({
  type,
  selectedLanguage,
  setShowLanguageEditForm,
  setShowLanguageAddForm
}): ReactElement => {
  const { sellerProfile, setSellerProfile } = useContext(SellerContext);
  const [language, setLanguage] = useState<ILanguage>({
    language: selectedLanguage ? `${selectedLanguage.language}` : '',
    level: selectedLanguage ? `${selectedLanguage.level}` : 'Level'
  });
  const onHandleUpdate = (): void => {
    if (type === 'add') {
      const newItem: ILanguage = {
        level: language.level,
        language: language.language
      };

      const clonedLanguages: ILanguage[] = cloneDeep(sellerProfile?.languages);
      clonedLanguages.push(newItem);
      if (setSellerProfile && setShowLanguageAddForm) {
        setSellerProfile({ ...sellerProfile, languages: clonedLanguages });
        setShowLanguageAddForm(false);
      }
    } else {
      const itemIndex: number = findIndex(sellerProfile.languages, (value: ILanguage) => value._id === selectedLanguage?._id);
      const clonedItem: ILanguage = {
        level: !language.language ? '' : language.level,
        language: language.language,
        _id: selectedLanguage?._id
      };
      const clonedLanguages: ILanguage[] = cloneDeep(sellerProfile.languages) as ILanguage[];
      clonedLanguages.splice(itemIndex, 1, clonedItem);
      const filtered = filter(clonedLanguages, (item: ILanguage) => item.language !== '');
      if (setSellerProfile && setShowLanguageEditForm && filtered.length > 0) {
        setSellerProfile({ ...sellerProfile, languages: clonedLanguages });
        setShowLanguageEditForm(false);
      } else {
        console.log('You need to have at least one language.');
      }
    }
  };
  return (
    <div className="flex w-full flex-col">
      <div className="mb-6 grid grid-cols-1 gap-y-3 px-3 md:grid-cols-2 md:gap-x-2">
        <div>
          <TextInput
            className="border-grey w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
            placeholder="Language"
            type="text"
            name="language"
            value={language.language}
            onChange={(e: ChangeEvent) => {
              setLanguage({ ...language, language: (e.target as HTMLInputElement).value });
            }}
          />
        </div>
        <div className="relative">
          <Dropdown
            text={language.level}
            maxHeight="300"
            mainClassNames="absolute bg-white z-50"
            showSearchInput
            values={languageLevel()}
            setValue={
              ((value: string) => {
                setLanguage({ ...language, level: value });
              }) as Dispatch<SetStateAction<string>>
            }
          />
        </div>
      </div>
      <div className="z-20 my-4 mt-10 flex cursor-pointer justify-center md:z-0 md:mt-0">
        <Button
          disabled={(language.level === 'Level' || !language.language) && type === 'add'}
          className={`md:text-md rounded bg-sky-500 px-6 py-1 text-center text-sm font-bold text-white hover:bg-sky-400 focus:outline-none md:py-2
          ${(language.level === 'Level' || !language.language) && type === 'add' ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
        `}
          onClick={onHandleUpdate}
          label={`${type === 'add' ? 'Add' : 'Update'}`}
        />
        &nbsp;&nbsp;
        <Button
          className="md:text-md rounded bg-gray-300 px-6 py-1 text-center text-sm font-bold hover:bg-gray-200 focus:outline-none md:py-2"
          label="Cancel"
          onClick={() => {
            if (type === 'add' && setShowLanguageAddForm) {
              setShowLanguageAddForm(false);
            } else if (type === 'edit' && setShowLanguageEditForm) {
              setShowLanguageEditForm(false);
            }
          }}
        />
      </div>
    </div>
  );
};

export default LanguageFields;
