import PropTypes from 'prop-types';
import React from 'react';
import {NativeSelect, Stack, Text} from '@chakra-ui/react';

export default function BedroomInput({numOfBeds, setNumOfBeds, ...props}) {
  return (
    <Stack direction="column" gap={2}>
      <Text as="label" fontSize="large" fontWeight="bold">
        Bedrooms
        <NativeSelect.Root mt="2" {...props}>
          <NativeSelect.Field
            onChange={e => setNumOfBeds(Number(e.target.value))}
            value={numOfBeds}
          >
            <option disabled="disabled">Number of bedrooms</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={5}>5+</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Text>
    </Stack>
  );
}

BedroomInput.propTypes = {
  numOfBeds: PropTypes.number.isRequired,
  setNumOfBeds: PropTypes.func.isRequired
};
