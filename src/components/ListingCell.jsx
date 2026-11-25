import PropTypes from 'prop-types';
import React from 'react';
import Stars from './Stars';
import {Box, Separator, Flex, Heading, Image, Text} from '@chakra-ui/react';
import {IoBed} from 'react-icons/io5';
import {Link} from 'react-router-dom';

export default function ListingCell({
  title,
  photoThumbnail,
  description,
  numOfBeds,
  costPerNight,
  overallRating,
  locationType,
  to
}) {
  return (
    <>
      <Box
        asChild
        overflow="hidden"
        width="100%"
        transition="0.3s all ease-in-out"
        opacity="95%"
        _hover={{
          cursor: 'pointer',
          transform: 'scale(1.1)',
          opacity: '100%'
        }}
        mb="2"
      >
        <Link to={to}>
          <Flex
            direction="row"
            justify="space-between"
            minH="120px"
            maxH="200px"
          >
            <Image
              src={photoThumbnail}
              alt={title}
              objectFit="cover"
              width="320px"
              maxW="320px"
              borderRadius="8"
            />
            <Flex
              direction="column"
              ml={6}
              justify="space-around"
              minH="120px"
              width="100%"
              css={{gap: '24px'}}
            >
              <Text
                fontSize="sm"
                fontWeight={600}
                textTransform="uppercase"
                fontFamily="Source Code Pro"
              >
                {locationType}
              </Text>
              <Flex direction="row" justify="space-between">
                <Heading as="h2" size="md">
                  {title}
                </Heading>
              </Flex>
              <Text
                fontSize="lg"
                fontWeight="regular"
                mr="1"
                maxWidth="650px"
                lineClamp={2}
              >
                {description}
              </Text>
              <Flex direction="row" justify="space-between">
                <Flex direction="row" align="center">
                  {overallRating ? (
                    <Stars size={20} rating={overallRating} />
                  ) : (
                    <Text>No reviews yet</Text>
                  )}
                  <Flex ml={6} align="center">
                    <IoBed size={22} />
                    <Text fontSize="lg" ml={1}>
                      {numOfBeds}
                    </Text>
                  </Flex>
                  <Flex fontSize="lg" ml={6}>
                    <Text fontWeight="bold"> ¤ {costPerNight}</Text> / night
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Link>
      </Box>
      <Separator />
    </>
  );
}

ListingCell.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  photoThumbnail: PropTypes.string,
  costPerNight: PropTypes.number,
  numOfBeds: PropTypes.number.isRequired,
  overallRating: PropTypes.number,
  locationType: PropTypes.string,
  to: PropTypes.string.isRequired
};
