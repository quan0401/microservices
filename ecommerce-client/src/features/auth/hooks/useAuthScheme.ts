import { useState } from 'react';

import { validationErrorsType } from '~shared/shared.interface';

import { IuseAuthScheme } from '../interfaces/auth.interface';

const useAuthScheme = ({ schema, userInfo }: IuseAuthScheme): [() => Promise<boolean>, validationErrorsType[]] => {
  const [validationErrors, setValidationErrors] = useState<validationErrorsType[]>([]);
  async function schemaValidation(): Promise<boolean> {
    // when it encounters error, it still continues (abortEarly: false)
    await schema
      .validate(userInfo, { abortEarly: false })
      .then(() => setValidationErrors([]))
      .catch((err) => {
        setValidationErrors([...err.errors]);
      });
    const validation: boolean = await schema.isValid(userInfo, { abortEarly: false });

    return validation;
  }
  return [schemaValidation, validationErrors];
};

export { useAuthScheme };
