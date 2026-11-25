import Layout from '../layouts/Layout';
import PropTypes from 'prop-types';
import QueryResult from '../components/QueryResult';
import React from 'react';
import Stars from '../components/Stars';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  StackSeparator,
  Text,
  VStack
} from '@chakra-ui/react';
import {HOST_LISTINGS} from '../utils';
import {IoAddCircleOutline} from 'react-icons/io5';
import {Link} from 'react-router-dom';
import {useQuery} from '@apollo/client/react';

function ListingLink({to, children}) {
  return (
    <Box
      asChild
      mr="4"
      color="indigo.dark"
      fontWeight="semibold"
      _hover={{textDecoration: 'underline'}}
    >
      <Link to={to}>{children}</Link>
    </Box>
  );
}

ListingLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default function Listings() {
  const {loading, error, data} = useQuery(HOST_LISTINGS);

  return (
    <Layout>
      <Flex w="full" justifyContent="space-between">
        <Heading as="h1" mb="4">
          My listings
        </Heading>
        <Button asChild mb="4">
          <Link to="/listings/create">
            <IoAddCircleOutline />
            Add
          </Link>
        </Button>
      </Flex>
      <QueryResult loading={loading} error={error} data={data}>
        {({hostListings}) => {
          return (
            <VStack
              gap="4"
              separator={<StackSeparator borderColor="gray.200" />}
            >
              {hostListings.map((listingData, index) => {
                const {
                  id,
                  title,
                  photoThumbnail,
                  overallRating,
                  numberOfUpcomingBookings
                } = listingData;
                return (
                  <Box key={`${title}-${index}`} overflow="hidden" w="full">
                    <Flex direction="row" flexWrap="wrap">
                      <Image
                        src={photoThumbnail}
                        alt={title}
                        objectFit="cover"
                        w="250px"
                        h="140px"
                        borderRadius={4}
                      />
                      <Flex direction="column" px="4">
                        <Flex direction="column" h="full">
                          <Heading as="h2" size="md">
                            {title}
                          </Heading>
                          <Flex flexWrap="wrap" mt={4}>
                            <Text mr={4}>
                              {numberOfUpcomingBookings} bookings
                            </Text>
                            {overallRating ? (
                              <Stars size={20} rating={overallRating} />
                            ) : (
                              <Text>No reviews yet</Text>
                            )}
                          </Flex>
                        </Flex>
                        <Flex>
                          <ListingLink to={`/listing/${id}/edit`}>
                            Edit
                          </ListingLink>
                          <ListingLink to={`/listing/${id}`}>View</ListingLink>
                          <ListingLink to={`/listing/${id}/bookings`}>
                            Manage Bookings
                          </ListingLink>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          );
        }}
      </QueryResult>
    </Layout>
  );
}
