import Layout from '../layouts/Layout';
import ListingForm from '../components/ListingForm';
import QueryResult from '../components/QueryResult';
import React from 'react';
import {Button} from '@chakra-ui/react';
import {IoArrowBackOutline} from 'react-icons/io5';
import {LISTING_FRAGMENT} from '../utils';
import {gql} from '@apollo/client';
import {useQuery} from '@apollo/client/react';
import {useNavigate, useParams} from 'react-router-dom';

export const EDIT_LISTING = gql`
  mutation UpdateListingMutation(
    $listingId: ID!
    $listing: UpdateListingInput!
  ) {
    updateListing(listingId: $listingId, listing: $listing) {
      success
      message
      listing {
        ...ListingFragment
        amenities {
          id
          category
          name
        }
      }
    }
  }
  ${LISTING_FRAGMENT}
`;

export const LISTING = gql`
  query GetListing($id: ID!) {
    listing(id: $id) {
      ...ListingFragment
      amenities {
        id
        name
        category
      }
    }
  }
  ${LISTING_FRAGMENT}
`;

export default function EditListing() {
  const navigate = useNavigate();
  const {id} = useParams();
  const {loading, error, data} = useQuery(LISTING, {variables: {id}});

  return (
    <Layout>
      <Button
        role="link"
        aria-label="Go back to previous page"
        onClick={() => navigate(-1)}
        mb="4"
      >
        <IoArrowBackOutline />
        Back
      </Button>
      <QueryResult loading={loading} error={error} data={data}>
        {data => {
          const {
            id: listingId,
            title,
            description,
            numOfBeds,
            locationType,
            photoThumbnail,
            amenities,
            costPerNight
          } = data.listing;

          const listingData = {
            title,
            description,
            numOfBeds,
            locationType,
            photoThumbnail,
            amenities,
            costPerNight
          };

          return (
            <ListingForm
              listingData={listingData}
              listingId={listingId}
              mutation={EDIT_LISTING}
              mutationOptions={{
                onCompleted: () => {
                  navigate(`/listing/${listingId}`);
                }
              }}
            />
          );
        }}
      </QueryResult>
    </Layout>
  );
}
