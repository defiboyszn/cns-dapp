/* eslint-disable @next/next/no-img-element */
import React from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';

enum CardVariant {
  primary = 'primary',
  secondary = 'secondary',
}

interface ICNSCard {
  variant?: CardVariant;
  title?: string;
  subtitle?: string;
  description?: string;
  imageSrc?: string;
}

const Card = ({
  variant = CardVariant.primary,
  title,
  subtitle,
  description,
  imageSrc,
}: ICNSCard) => {
  const cardStyle = {
    'bg-white': variant === CardVariant.primary,
    'bg-electric-pink-100': variant === CardVariant.secondary,
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      {imageSrc && (
        <img className="w-full" src={imageSrc} alt="card" />
      )}
      <div className={classNames('px-6 py-4', cardStyle)}>
        {title && (
          <div className="font-bold text-xl mb-2">
            {title}
          </div>
        )}
        {subtitle && (
          <p className="text-gray-700 text-base mb-2">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-gray-700 text-base">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;
