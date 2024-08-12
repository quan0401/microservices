import { FC, ReactElement } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '~shared/button/Button';
import { useAppDispatch } from '~/store/store';
import { IHeaderSideBarProps } from '~shared/header/interfaces/header.interface';
import { updateCategoryContainer } from '~shared/header/reducers/category.reducer';
import { updateHeader } from '~shared/header/reducers/header.reducer';
import HeaderSearchInput from '../HeaderSearchInput';

const MobileHeaderSearchInput: FC<IHeaderSideBarProps> = ({ setOpenSidebar }): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex w-full flex-col gap-y-3 md:hidden">
      {/* // <div className="flex w-full flex-col gap-y-3n "> */}
      <div className="flex w-full gap-x-1">
        <label htmlFor="hbr" className="peer-checked:hamburger relatives z-20 -ml-4 cursor-pointer pt-2">
          <Button
            className="m-auto flex items-center rounded transition duration-300"
            onClick={() => {
              if (setOpenSidebar) {
                setOpenSidebar(true);
              }
            }}
            label={<FaBars className="h-6 w-6" />}
          />
        </label>
        <Link
          to="/"
          onClick={() => {
            dispatch(updateHeader('home'));
            dispatch(updateCategoryContainer(true));
          }}
          className="relative z-10 flex w-full cursor-pointer justify-center self-center pr-12 text-2xl font-bold text-black lg:text-3xl"
        >
          Ecommerce
        </Link>
      </div>
      <HeaderSearchInput />
    </div>
  );
};

export default MobileHeaderSearchInput;
