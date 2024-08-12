/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { validationErrorsType } from '~shared/shared.interface';
import { ObjectSchema } from 'yup';

import { ICreateGig } from '../interfaces/gig.interface';

interface IUseGigScheme {
  scheme: ObjectSchema<ICreateGig | any>;
  gigInfo: ICreateGig;
}

const useGigScheme = ({ scheme, gigInfo }: IUseGigScheme): [() => Promise<boolean>, validationErrorsType[]] => {
  const [validationErrors, setValidationErrors] = useState<validationErrorsType[]>([]);

  async function schemeValidation(): Promise<boolean> {
    await scheme
      .validate(gigInfo, { abortEarly: false })
      .then(() => setValidationErrors([]))
      .catch((err) => {
        setValidationErrors([...err.errors]);
      });
    const validation: boolean = await scheme.isValid(gigInfo, { abortEarly: false });
    return validation;
  }
  return [schemeValidation, validationErrors];
};

export { useGigScheme };
