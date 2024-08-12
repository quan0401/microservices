import { ChangeEvent, FC, ReactElement, useState, KeyboardEvent } from 'react';
import { IPersonalInfoProps } from '~features/seller/interfaces/seller.interface';
import TextAreaInput from '~shared/inputs/TextAreaInput';
import TextInput from '~shared/inputs/TextInput';

const PersonalInfo: FC<IPersonalInfoProps> = ({ personalInfo, setPersonalInfo, personalInfoErrors }): ReactElement => {
  const [allowedInfoLength, setAllowInfoLength] = useState({
    description: '600/600',
    oneliner: '70/70'
  });

  const maxDescriptionCharacters = 600;
  const maxOneLinerCharacters = 70;
  return (
    <div className="border-b border-grey p-6">
      <div className="left-0 top-0 z-10 mt-4 block h-full bg-white">
        {personalInfoErrors.length > 0 ? (
          <div className="text-red-400">{`You have ${personalInfoErrors.length} error${personalInfoErrors.length > 1 ? 's' : ''}`}</div>
        ) : (
          <></>
        )}
      </div>
      <div className="mb-6 grid md:grid-cols-5">
        <div className="pb-2 text-base font-medium">
          Fullname<sup className="top-[-0.3em] text-base text-red-500">*</sup>
        </div>
        <div className="col-span-4 w-full">
          <TextInput
            className="border-grey mb-1 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
            type="text"
            name="fullname"
            value={personalInfo.fullName}
            onChange={(e: ChangeEvent) => {
              setPersonalInfo((prev) => ({ ...prev, fullName: (e.target as HTMLInputElement).value }));
            }}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-5 mb-6">
        <div className="text-base font-medium pb-2 mt-6 md:mt-0">
          Oneliner<sup className="text-red-500 text-base top-[-0.3em]">*</sup>
        </div>
        <div className="w-full col-span-4">
          <TextInput
            className="w-full rounded border border-grey p-2.5 mb-1 text-sm font-normal text-gray-600 focus:outline-none"
            type="text"
            name="oneliner"
            value={personalInfo.oneliner}
            onChange={(e: ChangeEvent) => {
              const onelinerValue: string = (e.target as HTMLInputElement).value;
              setPersonalInfo((prev) => ({ ...prev, oneliner: onelinerValue }));
              const counter: number = maxOneLinerCharacters - onelinerValue.length;
              setAllowInfoLength((prev) => ({ ...prev, oneliner: `${counter}/70` }));
            }}
            onKeyDown={(e: KeyboardEvent) => {
              const currentTextLength = (e.target as HTMLInputElement).value.length;
              if (currentTextLength === maxOneLinerCharacters && e.key !== 'Backspace') {
                e.preventDefault();
              }
            }}
            placeholder="E.g. Expert Mobile and Web Developer"
          />
          <span className="flex justify-end text-[#95979d] text-xs">{allowedInfoLength.oneliner}</span>
        </div>
      </div>
      <div className="grid md:grid-cols-5 mb-6">
        <div className="text-base font-medium pb-2">
          Description<sup className="text-red-500 text-base top-[-0.3em]">*</sup>
        </div>
        <div className="w-full col-span-4">
          <TextAreaInput
            className="w-full rounded border border-grey p-2.5 mb-1 text-sm font-normal text-gray-600 focus:outline-none"
            name="description"
            value={personalInfo.description}
            rows={5}
            onChange={(e: ChangeEvent) => {
              const descriptionValue: string = (e.target as HTMLInputElement).value;
              setPersonalInfo((prev) => ({ ...prev, description: descriptionValue }));
              const counter: number = maxDescriptionCharacters - descriptionValue.length;
              setAllowInfoLength((prev) => ({ ...prev, description: `${counter}/70` }));
            }}
            onKeyDown={(e: KeyboardEvent) => {
              const currentTextLength = (e.target as HTMLInputElement).value.length;
              if (currentTextLength === maxOneLinerCharacters && e.key !== 'Backspace') {
                e.preventDefault();
              }
            }}
          />
          <span className="flex justify-end text-[#95979d] text-xs">{allowedInfoLength.description}</span>
        </div>
      </div>
      <div className="grid md:grid-cols-5 mb-6">
        <div className="text-base font-medium pb-2">
          Response Time<sup className="text-red-500 text-base top-[-0.3em]">*</sup>
        </div>
        <div className="w-full col-span-4">
          <TextInput
            className="w-full rounded border border-grey p-2.5 mb-1 text-sm font-normal text-gray-600 focus:outline-none"
            type="number"
            name="responseTime"
            placeholder="E.g. 1"
            value={personalInfo.responseTime}
            onChange={(e: ChangeEvent) => {
              const value = (e.target as HTMLInputElement).value;
              setPersonalInfo({ ...personalInfo, responseTime: parseInt(value) > 0 ? value : '' });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
