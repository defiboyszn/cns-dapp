import classNames from 'classnames';
import { motion } from 'framer-motion';

import { ICNSButton, BtnVariant } from './types';

const Button = ({
  text,
  variant = BtnVariant.primary,
  full_width,
  on_click,
}: ICNSButton) => {
  const button_style = {
    'bg-black text-white': variant === BtnVariant.primary,
    'bg-transparent text-black border border-black':
      variant === BtnVariant.outline,
    'bg-electric-pink-550 text-white': variant === BtnVariant.secondary,
    'bg-white text-electric-pink-500': variant === BtnVariant.tertiary,
    'w-full': full_width,
  };

  return (
    <motion.button
      onClick={on_click}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.8 }}
      className={classNames(
        'rounded-2xl h-button min-w-button flex justify-center items-center font-bold text-base',
        button_style
      )}>
      <div>{text}</div>
    </motion.button>
  );
};

export default Button;
