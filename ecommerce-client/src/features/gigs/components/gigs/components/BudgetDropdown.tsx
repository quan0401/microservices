import { ChangeEvent, FC, ReactElement, useState, KeyboardEvent } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { ISelectedBudget } from '~features/gigs/interfaces/gig.interface';
import Button from '~shared/button/Button';
import TextInput from '~shared/inputs/TextInput';
import { saveToLocalStorage } from '~shared/utils/utils.service';

const BudgetDropdown: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [selectedBudget, setSelectedBudget] = useState<ISelectedBudget>({
    minPrice: '',
    maxPrice: ''
  });

  return (
    <div className="flex flex-col">
      <div className="relative">
        <Button
          className="flex justify-between items-center gap-5 rounded-lg border border-gray-400 px-5 py-3 font-medium"
          label={
            <>
              <span>Budget</span>
              {!toggleDropdown ? (
                <FaChevronDown className="float-right h-4 fill-current text-slate-900" />
              ) : (
                <FaChevronUp className="float-right h-4 fill-current text-slate-900" />
              )}
            </>
          }
          onClick={() => setToggleDropdown((prev: boolean) => !prev)}
        />
        {toggleDropdown && (
          <div className="absolute mt-2 w-96 divide-y divide-gray-100 rounded-lg border border-slate-100 bg-white drop-shadow-md sm:w-72">
            <ul className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="min" className="mb-2 block text-sm font-normal text-slate-900">
                      MIN.
                    </label>
                    <TextInput
                      type="number"
                      id="min"
                      min="0"
                      name="minPrice"
                      value={selectedBudget.minPrice ?? ''}
                      className="block w-full border border-gray-300 p-2.5 text-sm text-gray-900 dark:placeholder-gray-400 dark:focus:border-black dark:focus:ring-black"
                      placeholder="Any"
                      onChange={(e: ChangeEvent) => {
                        setSelectedBudget({ ...selectedBudget, minPrice: `${(e.target as HTMLInputElement).value}` });
                      }}
                      onKeyDown={(e: KeyboardEvent) => {
                        if (e.key !== 'Backspace' && isNaN(parseInt(e.key))) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="max" className="mb-2 block text-sm font-normal text-slate-900">
                      MAX.
                    </label>
                    <TextInput
                      type="number"
                      id="max"
                      name="maxPrice"
                      value={selectedBudget.maxPrice}
                      className="block w-full border border-gray-300 p-2.5 text-sm text-gray-900 dark:placeholder-gray-400 dark:focus:border-black dark:focus:ring-black"
                      placeholder="Any"
                      onChange={(e: ChangeEvent) => {
                        setSelectedBudget({ ...selectedBudget, maxPrice: `${(e.target as HTMLInputElement).value}` });
                      }}
                      onKeyDown={(e: KeyboardEvent) => {
                        if (e.key !== 'Backspace' && isNaN(parseInt(e.key))) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
              </li>
            </ul>
            <div className="my-4 flex cursor-pointer justify-evenly pt-3">
              <div
                className="px-4 py-2 text-sm font-medium text-slate-900"
                onClick={() => {
                  setSelectedBudget({ minPrice: '', maxPrice: '' });
                  setToggleDropdown(false);

                  const updatedSearchParams: URLSearchParams = new URLSearchParams(searchParams.toString());
                  updatedSearchParams.delete('minPrice');
                  updatedSearchParams.delete('maxPrice');
                  setSearchParams(updatedSearchParams);
                  setToggleDropdown(false);
                  saveToLocalStorage('filterApplied', JSON.stringify(true));
                }}
              >
                Clear All
              </div>
              <div
                onClick={() => {
                  const updatedSearchParams: URLSearchParams = new URLSearchParams(searchParams.toString());
                  updatedSearchParams.set('minPrice', selectedBudget.minPrice);
                  updatedSearchParams.set('maxPrice', selectedBudget.maxPrice);
                  setSearchParams(updatedSearchParams);
                  setToggleDropdown(false);
                  saveToLocalStorage('filterApplied', JSON.stringify(true));
                }}
                className="rounded bg-sky-500 px-4 py-2 text-sm font-bold text-white hover:bg-sky-400"
              >
                Apply
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 flex h-10 gap-4 text-xs text-slate-950">
        {selectedBudget.minPrice && selectedBudget.maxPrice && (
          <Button
            className="flex gap-4 self-center rounded-full bg-gray-200 px-5 py-1 font-bold hover:text-gray-500"
            label={
              <>
                ${selectedBudget.minPrice} - ${selectedBudget.maxPrice}
                <FaTimes className="self-center font-normal" />
              </>
            }
            onClick={() => {
              const updatedSearchParams: URLSearchParams = new URLSearchParams(searchParams.toString());
              updatedSearchParams.delete('minPrice');
              updatedSearchParams.delete('maxPrice');
              setSearchParams(updatedSearchParams);
              setToggleDropdown(false);
              setSelectedBudget({ minPrice: '', maxPrice: '' });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BudgetDropdown;
