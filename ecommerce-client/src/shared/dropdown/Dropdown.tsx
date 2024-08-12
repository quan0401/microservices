import { filter } from 'lodash';
import { ChangeEvent, FC, lazy, LazyExoticComponent, MouseEvent, ReactElement, useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import TextInput from '~/shared/inputs/TextInput';
import { IButtonProps, IDropdownProps } from '~/shared/shared.interface';

const Button: LazyExoticComponent<FC<IButtonProps>> = lazy(() => import('~/shared/button/Button'));

const Dropdown: FC<IDropdownProps> = ({
  text,
  values,
  maxHeight,
  mainClassNames,
  dropdownClassNames,
  showSearchInput,
  style,
  placeholder,
  setValue,
  onClick,
  onFocus
}): ReactElement => {
  const [dropdownItems, setDropdownItems] = useState<string[]>(values);
  const [inputText, setInputText] = useState<string>(text);

  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);

  const onHandleSelect = (event: MouseEvent): void => {
    const selectedItem: string = (event.target as HTMLLIElement).textContent as string;
    if (setValue) {
      setValue(selectedItem);
    }
    setToggleDropdown(false);
    setInputText(selectedItem);
    if (onClick) {
      onClick(selectedItem);
    }
  };

  useEffect(() => {
    // dynamic passing values
    setDropdownItems(values);
  }, [values]);

  return (
    <div
      className={`w-full divide-y divide-gray-100 rounded border ${mainClassNames}`}
      style={style}
      onFocus={() => {
        if (onFocus) {
          onFocus();
        }
      }}
    >
      {(!showSearchInput || showSearchInput) && !toggleDropdown && (
        <Button
          className="bg-teal flex w-full justify-between rounded px-3 py-2 text-white"
          label={
            <>
              <span className="truncate text-slate-900">{text}</span>
              {!toggleDropdown ? (
                <FaChevronDown className="float-right mt-1 h-4 fill-current text-slate-900" />
              ) : (
                <FaChevronUp className="float-right mt-1 h-4 fill-current text-slate-900" />
              )}
            </>
          }
          onClick={() => setToggleDropdown(true)}
        />
      )}
      {showSearchInput && toggleDropdown && (
        <div className="flex">
          <TextInput
            type="text"
            name="search"
            value={inputText}
            className="h-10 w-full items-center rounded pl-3 text-sm font-normal text-gray-600 focus:outline-none lg:text-base"
            placeholder={placeholder}
            onChange={(e: ChangeEvent) => {
              const inputValue: string = (e.target as HTMLInputElement).value;
              setInputText(inputValue);
              const filtered: string[] = filter(dropdownItems, (item: string) => item.toLowerCase().includes(inputValue.toLowerCase()));
              setDropdownItems(filtered);
              if (!inputValue) {
                setDropdownItems(values);
              }
            }}
          />
          <div className="flex self-center" onClick={() => setToggleDropdown(!toggleDropdown)}>
            <FaTimes className="mx-3 h-4 fill-current text-slate-900 cursor-pointer" />
          </div>
        </div>
      )}
      {toggleDropdown && (
        <ul
          className={`z-40 cursor-pointer overflow-y-scroll py-2 text-sm text-gray-700 dark:text-gray-200
          ${dropdownClassNames}`}
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {dropdownItems.map((value: string) => (
            <li key={uuidv4()} onClick={onHandleSelect}>
              <div className="block px-4 py-2 text-slate-900 dark:hover:bg-gray-200">{value}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
