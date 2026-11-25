import PropTypes from 'prop-types';
import React from 'react';
import {Avatar, Image as ChakraImage} from '@chakra-ui/react';

export function Image({src, alt, name, isAvatar = false, w, h}) {
  const IMG_PROPS = {
    h: h ? h : 'full',
    bg: 'gray.50'
  };

  if (isAvatar) {
    return (
      <Avatar.Root {...IMG_PROPS} w={w ? w : 'auto'}>
        <Avatar.Fallback name={name} />
        <Avatar.Image src={src} alt={alt} />
      </Avatar.Root>
    );
  }

  return (
    <ChakraImage
      {...IMG_PROPS}
      src={src}
      alt={alt}
      w={w ? w : '200px'}
      borderRadius={4}
    />
  );
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  name: PropTypes.string,
  isAvatar: PropTypes.bool,
  w: PropTypes.string,
  h: PropTypes.string
};
