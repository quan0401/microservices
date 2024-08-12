import React, { FC, ReactElement } from 'react';

import { IButtonProps } from '~/shared/shared.interface';

const Button: FC<IButtonProps> = (props): ReactElement => {
  const { id, label, className, disabled, role, type, testId, onClick } = props;
  return (
    <button data-testid={testId} id={id} className={className} disabled={disabled} role={role} type={type} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
