import { ChangeEvent, FC, KeyboardEvent, ReactElement, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ITagsInputProps } from '~features/gigs/interfaces/gig.interface';
import TextInput from '~shared/inputs/TextInput';

const TagsInput: FC<ITagsInputProps> = (props): ReactElement => {
  const { title, placeholder, gigInfo, tags, itemName, itemInput, inputErrorMessage, counterText, setItem, setItemInput, setGigInfo } =
    props;
  const [isKeyReleased, setIsKeyReleased] = useState<boolean>(false);
  const maxTagCount = 10;
  const onChange = (e: ChangeEvent): void => {
    const { value } = e.target as HTMLInputElement;
    setItemInput(value);
  };
  const onKeyUp = (): void => {
    setIsKeyReleased(true);
  };
  const onKeyDown = (e: KeyboardEvent, input: string, tagsList: string[]): void => {
    const { key } = e;
    const trimmedInput: string = input.trim();
    if (tagsList.length + 1 <= maxTagCount) {
      if ((key === ',' || key === 'Enter') && trimmedInput.length && !tags.includes(trimmedInput)) {
        e.preventDefault();
        setItem((prev: string[]) => [...prev, trimmedInput]);
        setItemInput('');
        const gigInfoList: string[] = gigInfo[`${itemName}`] as string[];
        setGigInfo({ ...gigInfo, [`${itemName}`]: [...gigInfoList, trimmedInput] });
      }
    }

    if (key === 'Backspace' && !input.length && tagsList.length && isKeyReleased) {
      const tagsCopy: string[] = [...tagsList];
      const poppedTag: string = tagsCopy.pop() as string;
      e.preventDefault();
      setItem(tagsCopy);
      setItemInput(poppedTag);
      setGigInfo({ ...gigInfo, [`${itemName}`]: [...tagsCopy] });
    }
    setIsKeyReleased(false);
  };

  const deleteTag = (index: number): void => {
    setItem((prev: string[]) => prev.filter((_, i: number) => i !== index));
    const gigInfoList: string[] = gigInfo[`${itemName}`] as string[];
    setGigInfo({ ...gigInfo, [`${itemName}`]: gigInfoList.filter((_, i: number) => i !== index) });
  };

  return (
    <div className="mb-6 grid md:grid-cols-5">
      <div className="mt-6 pb-2 text-base font-medium lg:mt-0">
        {title}
        <sup className="top-[-0.3em] text-base text-red-500">*</sup>
      </div>
      <div className="col-span-4 md:w-11/12 lg:w-8/12">
        <div className="flex w-full flex-wrap py-[4px]">
          {tags.map((tag: string, index: number) => (
            <div
              key={uuidv4()}
              className="my-[2px] mr-1 flex items-center whitespace-nowrap rounded-[50px] bg-sky-500 px-4 text-sm font-bold text-white"
            >
              {tag}
              <span onClick={() => deleteTag(index)} className="flex cursor-pointer p-[6px] text-red-800">
                x
              </span>
            </div>
          ))}
        </div>
        <TextInput
          type="text"
          name={title}
          value={itemInput}
          className="border-grey mb-1 w-full rounded border p-2.5 text-sm font-normal text-gray-600 focus:outline-none"
          placeholder={placeholder}
          onChange={(e: ChangeEvent) => onChange(e)}
          onKeyDown={(e: KeyboardEvent) => onKeyDown(e, itemInput, tags)}
          onKeyUp={onKeyUp}
        />
        <span className="flex justify-end text-xs text-[#95979d]">
          {maxTagCount - tags.length} {counterText}
        </span>
      </div>
    </div>
  );
};

export default TagsInput;
