import React from 'react';
import PropTypes from 'prop-types';

const SearchIcon = ({
  size = 24,
  color = 'currentColor',
  ariaLabel,
  className,
}) => {
  React.useEffect(() => {
    console.warn(
      'SearchIcon is deprecated and will be removed in a future release. Please use the <Icon /> component instead: https://noeldapp.github.io/noeldapp-storybook/?path=/docs/components-componentlibrary-icon--default-story#icon'
    );
  }, []);

  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      aria-label={ariaLabel}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path d="m235 427c-51 0-100-21-136-57-36-36-56-84-56-135 0-26 5-51 14-74 
        10-23 24-44 
        ... 
        -150z" />
    </svg>
)};

SearchIcon.propTypes = {
 size: PropTypes.number,
 color: PropTypes.string,
 className: PropTypes.string,
 ariaLabel: PropTypes.string,
};

export default SearchIcon;
