import PropTypes from 'prop-types';
import React, {useState} from 'react';
import StarRating from './StarRating';
import {Flex, Text, Textarea} from '@chakra-ui/react';

export function ReviewRating({
  setReviewsInput = () => {},
  reviewType = '',
  rating = null
}) {
  const [value, setRating] = useState(0);

  const updateState = newRating => {
    setRating(newRating);
    setReviewsInput(prevState => {
      return {
        ...prevState,
        [`${reviewType}Review`]: {
          ...prevState[`${reviewType}Review`],
          rating: newRating
        }
      };
    });
  };

  return (
    <StarRating
      size={16}
      edit={rating === null}
      value={rating !== null ? rating : value}
      onChange={updateState}
    />
  );
}

ReviewRating.propTypes = {
  setReviewsInput: PropTypes.func,
  reviewType: PropTypes.string,
  rating: PropTypes.number
};

export default function ReviewInput({reviewType, setReviewsInput}) {
  const [textVal, setTextVal] = useState('');
  const updateState = e => {
    setReviewsInput(prevState => {
      return {
        ...prevState,
        [`${reviewType}Review`]: {
          ...prevState[`${reviewType}Review`],
          text: e.target.value
        }
      };
    });
  };
  return (
    <>
      <Flex alignItems="center">
        <Text fontWeight="semibold" textTransform="capitalize" mr={2}>
          {reviewType}
        </Text>
        <ReviewRating
          setReviewsInput={setReviewsInput}
          reviewType={reviewType}
        />
      </Flex>
      <Textarea
        placeholder="Leave your review"
        value={textVal}
        onChange={e => {
          setTextVal(e.target.value);
          updateState(e);
        }}
        w="400px"
      />
    </>
  );
}

ReviewInput.propTypes = {
  reviewType: PropTypes.string.isRequired,
  setReviewsInput: PropTypes.func.isRequired
};
