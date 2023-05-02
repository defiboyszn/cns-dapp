import React from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';

enum InputVariant {
  primary = 'primary',
  outline = 'outline',
  secondary = 'secondary',
  tertiary = 'tertiary',
}

interface ICNSInput {
  variant?: InputVariant;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  variant = InputVariant.primary,
  label,
  placeholder,
  value,
  onChange,
}: ICNSInput) => {
  const inputStyle = {
    'border-black': variant === InputVariant.outline,
    'bg-electric-pink-200': variant === InputVariant.secondary,
    'border-b-2 border-electric-pink-500': variant === InputVariant.tertiary,
  };

  return (
    <div className="flex flex-col mb-3">
      {label && (
        <label className="font-bold mb-1 text-sm text-electric-pink-500" htmlFor="input">
          {label}
        </label>
      )}
      <motion.input
        type="text"
        id="input"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={classNames(
          'h-10 rounded-l-lg pl-4 pr-10 w-full',
          inputStyle,
          'text-black focus:outline-none focus:ring-2 focus:ring-electric-pink-500'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
    </div>
  );
};

export default Input;
