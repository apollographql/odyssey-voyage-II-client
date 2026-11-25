import PropTypes from 'prop-types';

import BookStay from '../components/BookStay';
import Layout from '../layouts/Layout';
import LocationType from '../components/LocationType';
import QueryResult from '../components/QueryResult';
import React from 'react';
import Stars from '../components/Stars';
import startCase from 'lodash/startCase';

import {
  Avatar,
  Box,
  Button,
  Separator,
  Flex,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
  Wrap
} from '@chakra-ui/react';
import {GUEST_TRIPS} from './trips';
import {IoBedOutline, IoCreate} from 'react-icons/io5';
import {Link, useParams} from 'react-router-dom';
import {gql} from '@apollo/client';
import {useQuery} from '@apollo/client/react';
import {useUser} from '../utils';

export const LISTING = gql`
  query GetListing($id: ID!) {
    listing(id: $id) {
      id
      title
      description
      photoThumbnail
      numOfBeds
      costPerNight
      locationType
      amenities {
        name
        category
      }
      overallRating
      reviews {
        text
        author {
          id
          name
          profilePicture
        }
        rating
      }
      host {
        id
        name
        profilePicture
        profileDescription
        overallRating
      }
      bookings {
        checkInDate
        checkOutDate
      }
    }
  }
`;

function AmenityList({amenities, category}) {
  const title = startCase(category.toLowerCase());
  return (
    <Stack gap="3">
      <Text fontWeight="semibold">{title}</Text>
      <Wrap gap="2">
        {amenities.map(amenity => (
          <Text
            key={amenity}
            borderWidth="1px"
            borderColor="gray.200"
            py="2"
            px="3"
            borderRadius="4"
          >
            {amenity}
          </Text>
        ))}
      </Wrap>
    </Stack>
  );
}

AmenityList.propTypes = {
  category: PropTypes.string,
  amenities: PropTypes.array
};

export default function Listings() {
  const {id} = useParams();
  const {user} = useUser();
  const {loading, error, data} = useQuery(LISTING, {variables: {id}});

  return (
    <Layout>
      <QueryResult loading={loading} error={error} data={data}>
        {data => {
          const {
            id,
            title,
            description,
            numOfBeds,
            locationType,
            photoThumbnail,
            amenities,
            host,
            reviews,
            overallRating,
            costPerNight,
            bookings
          } = data.listing;

          const amenitiesByCategory = amenities.reduce((acc, amenity) => {
            if (acc[amenity.category]) {
              acc[amenity.category] = [...acc[amenity.category], amenity.name];
            } else {
              acc[amenity.category] = [amenity.name];
            }
            return acc;
          }, {});

          return (
            <Stack direction="column" mb="12" gap="6">
              <Flex justifyContent="space-between">
                <Stack>
                  <Heading as="h1" size="lg">
                    {title}
                  </Heading>
                  {overallRating ? (
                    <Stars size={20} rating={overallRating} />
                  ) : (
                    <Text>Uh-oh, this place has no reviews yet!</Text>
                  )}
                </Stack>
                {host && user && host.id === user.id && (
                  <Button asChild ml="4">
                    <Link to={`/listing/${id}/edit`}>
                      Edit your listing
                      <IoCreate size={20} />
                    </Link>
                  </Button>
                )}
              </Flex>
              <Image
                src={photoThumbnail}
                alt={title}
                objectFit="cover"
                width="100%"
                borderRadius={8}
              />
              <Flex direction="row" flexWrap="wrap">
                <Stack flex="1" direction="column" gap="6" mr={8}>
                  <Stack gap="4">
                    <Heading as="h2" size="md">
                      Details
                    </Heading>
                    <HStack gap="16" align="top">
                      <Stack gap="2">
                        <Text fontWeight="bold">Number of beds</Text>
                        <Stack align="center" direction="row">
                          <IoBedOutline size={22} />
                          <Text ml="1">{numOfBeds} beds</Text>
                        </Stack>
                      </Stack>
                      <Stack gap="2">
                        <Text fontWeight="bold">Location Type </Text>
                        <Stack align="center" direction="row">
                          <LocationType locType={locationType} size="22px" />
                          <Text textTransform="capitalize" ml="1">
                            {locationType}
                          </Text>
                        </Stack>
                      </Stack>
                    </HStack>
                  </Stack>
                  <Separator />
                  <Stack>
                    <Heading as="h2" size="md">
                      About this location
                    </Heading>
                    <Text fontSize="lg" fontWeight="regular" mr="1">
                      {description}
                    </Text>
                  </Stack>
                  <Separator />
                  <Box>
                    <Heading as="h2" size="md" mb="2">
                      Amenities
                    </Heading>
                    <Stack gap="3">
                      {Object.entries(amenitiesByCategory).map(
                        ([key, value]) => (
                          <AmenityList
                            category={key}
                            amenities={value}
                            key={key}
                          />
                        )
                      )}
                    </Stack>
                  </Box>
                  <Separator />
                  <Box>
                    <Heading as="h2" size="md" mb="2">
                      Meet your host
                    </Heading>
                    <Flex align="flex-start" justify="space-between">
                      <Stack>
                        <Flex>
                          <Text fontWeight="semibold" mr={4}>
                            {host.name}
                          </Text>
                          <Stars size={16} rating={host.overallRating} />
                        </Flex>
                        <Text>{host.profileDescription}</Text>
                      </Stack>
                      <Avatar.Root
                        size="md"
                        borderColor="white"
                        borderWidth="1px"
                        ml={4}
                        bg="gray.50"
                      >
                        <Avatar.Fallback name="profile" />
                        <Avatar.Image src={host.profilePicture} />
                      </Avatar.Root>
                    </Flex>
                  </Box>
                  <Separator />
                  <Box>
                    <Heading as="h2" size="md" mb="6">
                      What other space travelers have to say about this stay
                    </Heading>
                    <Stack direction="column" gap="6">
                      {reviews.length === 0 ? (
                        <Text>Uh-oh, this place has no reviews yet!</Text>
                      ) : (
                        reviews.map(({text, author, rating}) => (
                          <Flex align="flex-start" key={author.id}>
                            <Stack>
                              <Avatar.Root
                                size="md"
                                borderColor="white"
                                borderWidth="1px"
                                bg="gray.50"
                              >
                                <Avatar.Fallback name="profile" />
                                <Avatar.Image src={author.profilePicture} />
                              </Avatar.Root>
                            </Stack>
                            <Stack direction="column" gap="1" pl={4}>
                              <HStack align="flex-start">
                                <Heading size="sm">{author.name}</Heading>
                                <Stars size={16} rating={rating} />
                              </HStack>
                              <Text>{text}</Text>
                            </Stack>
                          </Flex>
                        ))
                      )}
                    </Stack>
                  </Box>
                </Stack>

                <BookStay
                  costPerNight={costPerNight}
                  bookings={bookings}
                  listingId={id}
                  refetchQueries={[LISTING, {query: GUEST_TRIPS}]}
                  userRole={user?.__typename}
                />
              </Flex>
            </Stack>
          );
        }}
      </QueryResult>
    </Layout>
  );
}
