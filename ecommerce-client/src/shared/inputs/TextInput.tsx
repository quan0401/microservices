import { forwardRef, ForwardRefExoticComponent, RefAttributes } from 'react';

import { ITextInputProps } from '~shared/shared.interface';

// const TextInput: ForwardRefExoticComponent<ITextInputProps > = forwardRef((props, ref) => (
const TextInput: ForwardRefExoticComponent<Omit<ITextInputProps, 'ref'> & RefAttributes<HTMLInputElement>> = forwardRef((props, ref) => (
  <>
    <input
      ref={ref}
      id={props.id}
      name={props.name}
      type={props.type}
      value={props.value}
      placeholder={props.placeholder}
      className={props.className}
      style={props.style}
      readOnly={props.readOnly}
      checked={props.checked}
      autoFocus={props.autoFocus}
      maxLength={props.maxLength}
      min={props.min}
      max={props.max}
      onChange={props.onChange}
      onClick={props.onClick}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onKeyUp={props.onKeyUp}
      onKeyDown={props.onKeyDown}
      autoComplete="false"
    />
  </>
));

export default TextInput;
