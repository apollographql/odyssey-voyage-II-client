import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {IoStar, IoStarOutline} from 'react-icons/io5';

const STAR_COUNT = 5;

// A small, dependency-free star rating input (replaces react-rating-stars-component)
export default function StarRating({
  value = 0,
  onChange = () => {},
  edit = true,
  size = 16,
  color = 'black'
}) {
  const [hovered, setHovered] = useState(null);
  const shown = edit && hovered !== null ? hovered : value;

  return (
    <div
      role={edit ? 'group' : 'img'}
      aria-label={`${value} out of ${STAR_COUNT} stars`}
      style={{display: 'inline-flex', gap: 2}}
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({length: STAR_COUNT}, (_, i) => {
        const position = i + 1;
        const Icon = shown >= position ? IoStar : IoStarOutline;
        const icon = <Icon size={size} color={color} />;

        if (!edit) {
          return <span key={position}>{icon}</span>;
        }

        return (
          <button
            key={position}
            type="button"
            aria-label={`${position} star${position > 1 ? 's' : ''}`}
            onClick={() => onChange(position)}
            onMouseEnter={() => setHovered(position)}
            style={{
              background: 'none',
              border: 0,
              padding: 0,
              cursor: 'pointer',
              display: 'inline-flex'
            }}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}

StarRating.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  edit: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string
};
