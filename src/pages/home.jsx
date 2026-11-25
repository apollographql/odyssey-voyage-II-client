import BedroomInput from '../components/BedroomInput';
import DateInput from '../components/DateInput';
import Hero from '../components/Hero';
import Layout from '../layouts/Layout';
import ListingCard from '../components/ListingCard';
import Nav from '../components/Nav';
import PropTypes from 'prop-types';
import QueryResult from '../components/QueryResult';
import React, {useState} from 'react';
import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text
} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import {format} from 'date-fns';
import {getDatePickerProps, getNextDate} from '../utils';
import {gql} from '@apollo/client';
import {useQuery} from '@apollo/client/react';

import 'react-datepicker/dist/react-datepicker.css';

export const FEATURED_LISTINGS = gql`
  query GetFeaturedListings {
    featuredListings {
      id
      title
      photoThumbnail
      numOfBeds
      overallRating
      locationType
      costPerNight
    }
  }
`;

const INPUT_PROPS = {
  size: 'lg',
  width: 'auto',
  maxWidth: '300px',
  marginTop: '2'
};

export default function Home() {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(getNextDate(today));
  const [numOfBeds, setNumOfBeds] = useState(1);

  const DATEPICKER_PROPS = getDatePickerProps({
    today,
    startDate,
    endDate,
    setStartDate,
    setEndDate
  });

  const {loading, error, data} = useQuery(FEATURED_LISTINGS);

  return (
    <>
      <Nav />
      <Hero>
        <Center minHeight="500px">
          <Container maxWidth="100%">
            <Flex
              direction="column"
              justify="space-between"
              minH="225px"
              align="center"
            >
              <Heading as="h1" size="3xl" mb={4} color="white">
                Your home away from homeworld
              </Heading>
              <Heading as="h2" size="md" mb={10} fontWeight={500} color="white">
                Let&apos;s plan your next space adventure!
              </Heading>
              <Stack
                gap={4}
                p={6}
                borderRadius={3}
                direction={{base: 'column', sm: 'row'}}
                maxWidth="862px"
                alignItems="flex-end"
                bgColor="white"
              >
                <InputContainer label="Check-in Date">
                  <DateInput
                    {...DATEPICKER_PROPS}
                    inputProps={{...INPUT_PROPS, width: '150px'}}
                    selected={startDate}
                  />
                </InputContainer>
                <InputContainer label="Check-out Date">
                  <DateInput
                    {...DATEPICKER_PROPS}
                    inputProps={{...INPUT_PROPS, width: '150px'}}
                    minDate={today < startDate ? startDate : today}
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                  />
                </InputContainer>
                <BedroomInput
                  {...INPUT_PROPS}
                  numOfBeds={numOfBeds}
                  setNumOfBeds={setNumOfBeds}
                />
                <Button asChild>
                  <Link
                    to={`/search/?startDate=${format(
                      startDate,
                      'MM-dd-yyyy'
                    )}&endDate=${format(
                      endDate,
                      'MM-dd-yyyy'
                    )}&numOfBeds=${numOfBeds}`}
                  >
                    Find a place
                  </Link>
                </Button>
              </Stack>
            </Flex>
          </Container>
        </Center>
      </Hero>
      <QueryResult loading={loading} error={error} data={data}>
        {data => (
          <Layout noNav p={12} pt={8}>
            <Heading as="h1" fontSize="3xl" fontWeight="bold" mb={6}>
              Ideas for your next stellar trip
            </Heading>
            <SimpleGrid minChildWidth="255px" gap={6}>
              {data &&
                data.featuredListings.map(listing => (
                  <ListingCard key={listing.title} {...listing} />
                ))}
            </SimpleGrid>
          </Layout>
        )}
      </QueryResult>
    </>
  );
}

function InputContainer({label, children}) {
  return (
    <Stack direction="column" gap={2}>
      <Text as="label" fontSize="large" fontWeight="bold">
        {label}
        {children}
      </Text>
    </Stack>
  );
}

InputContainer.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node
};
