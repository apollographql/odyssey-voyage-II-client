import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import React from 'react';
import {Input} from '@chakra-ui/react';

// react-datepicker wrapped so that it renders a Chakra Input.
// `inputProps` are passed to the Chakra Input; everything else goes to DatePicker.
export default function DateInput({inputProps, ...props}) {
  return <DatePicker customInput={<Input {...inputProps} />} {...props} />;
}

DateInput.propTypes = {
  inputProps: PropTypes.object
};
