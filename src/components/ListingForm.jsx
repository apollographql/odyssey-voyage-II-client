import PropTypes from 'prop-types';
import QueryResult from './QueryResult';
import React, {useState} from 'react';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';
import startCase from 'lodash/startCase';
import union from 'lodash/union';
import {
  Button,
  Checkbox,
  Field,
  Fieldset,
  Flex,
  Grid,
  Group,
  HStack,
  Input,
  InputAddon,
  NativeSelect,
  NumberInput,
  Stack,
  Text,
  Textarea,
  Wrap
} from '@chakra-ui/react';
import {gql} from '@apollo/client';
import {useMutation, useQuery} from '@apollo/client/react';

export const AMENITIES = gql`
  query GetAllAmenities {
    listingAmenities {
      id
      category
      name
    }
  }
`;

export default function ListingForm({
  mutation,
  mutationOptions,
  listingId,
  listingData
}) {
  const {loading, error, data} = useQuery(AMENITIES);

  return (
    <QueryResult loading={loading} error={error} data={data}>
      {({listingAmenities}) => (
        <ListingFormBody
          listingId={listingId}
          listingData={listingData}
          mutation={mutation}
          amenities={listingAmenities}
          mutationOptions={mutationOptions}
        />
      )}
    </QueryResult>
  );
}

ListingForm.propTypes = {
  listingData: PropTypes.object.isRequired,
  listingId: PropTypes.string,
  mutation: PropTypes.object.isRequired,
  mutationOptions: PropTypes.object.isRequired
};

function ListingFormBody({
  listingData,
  amenities,
  listingId,
  mutation,
  mutationOptions
}) {
  const listingAmenities = listingData.amenities.map(amenity => amenity.id);
  const allAmenities = amenities.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.category]: acc[curr.category]
        ? [...acc[curr.category], curr]
        : [curr]
    };
  }, {});

  const [formValues, setFormValues] = useState({
    amenities: listingAmenities
  });

  const [submitListing, {loading}] = useMutation(mutation, mutationOptions);

  const handleAmenityChange = (amenityId, isChecked) => {
    setFormValues(prevState => ({
      ...prevState,
      amenities: isChecked
        ? [...prevState.amenities, amenityId]
        : prevState.amenities.filter(id => id !== amenityId)
    }));
  };

  const handleSelectAll = allAmenitiesInCategory => {
    setFormValues(prevState => {
      return {
        ...prevState,
        amenities: union(prevState.amenities, allAmenitiesInCategory) // union merges and deduplicates arrays
      };
    });
  };

  const handleDeselectAll = allAmenitiesInCategory => {
    setFormValues(prevState => {
      const newAmenities = prevState.amenities.filter(
        a => !allAmenitiesInCategory.includes(a)
      );
      return {
        ...prevState,
        amenities: newAmenities
      };
    });
  };
  return (
    <Stack
      as="form"
      onSubmit={e => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const uncontrolledInputs = Object.fromEntries(formData);
        uncontrolledInputs.costPerNight = Number(
          uncontrolledInputs.costPerNight
        );
        uncontrolledInputs.numOfBeds = Number(uncontrolledInputs.numOfBeds);

        submitListing({
          variables: {
            listingId,
            listing: {...uncontrolledInputs, ...formValues}
          }
        });
      }}
      gap="8"
      mb="4"
    >
      <Fieldset.Root>
        <Stack gap="4">
          <Fieldset.Legend fontSize="xl" fontWeight="bold">
            General information
          </Fieldset.Legend>
          <Field.Root required>
            <Field.Label fontWeight="bold">
              Title
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              type="text"
              name="title"
              placeholder="Give your location a name"
              defaultValue={listingData.title}
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label fontWeight="bold">
              Description
              <Field.RequiredIndicator />
            </Field.Label>
            <Textarea
              name="description"
              placeholder="Describe your location"
              defaultValue={listingData.description}
            />
          </Field.Root>
        </Stack>
      </Fieldset.Root>

      <Fieldset.Root>
        <Stack gap="4">
          <Fieldset.Legend fontSize="xl" fontWeight="bold">
            Location details
          </Fieldset.Legend>
          <Wrap gap={6} align="flex-start">
            <Field.Root required maxW="250px">
              <Field.Label fontWeight="bold">
                Location type
                <Field.RequiredIndicator />
              </Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  name="locationType"
                  placeholder="Select option"
                  defaultValue={listingData.locationType}
                >
                  <option value="APARTMENT">Apartment</option>
                  <option value="CAMPSITE">Campsite</option>
                  <option value="HOUSE">House</option>
                  <option value="ROOM">Room</option>
                  <option value="SPACESHIP">Spaceship</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
            <Field.Root maxW="146px">
              <Field.Label fontWeight="bold">Bedrooms</Field.Label>
              <NumberInput.Root
                name="numOfBeds"
                min={1}
                defaultValue={String(listingData.numOfBeds)}
              >
                <NumberInput.Control />
                <NumberInput.Input />
              </NumberInput.Root>
            </Field.Root>
            <Field.Root required maxW="146px">
              <Field.Label fontWeight="bold">
                Cost per night
                <Field.RequiredIndicator />
              </Field.Label>
              <Group attached w="full">
                <InputAddon bg="transparent" pr="0">
                  ¤
                </InputAddon>
                <NumberInput.Root
                  name="costPerNight"
                  min={1}
                  defaultValue={String(listingData.costPerNight)}
                >
                  <NumberInput.Input
                    borderLeftWidth="0"
                    borderTopLeftRadius="0"
                    borderBottomLeftRadius="0"
                  />
                </NumberInput.Root>
              </Group>
            </Field.Root>
            <Field.Root required flex={1}>
              <Field.Label fontWeight="bold">
                Image
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                name="photoThumbnail"
                type="text"
                placeholder="Image URL"
                defaultValue={listingData.photoThumbnail}
              />
            </Field.Root>
          </Wrap>
        </Stack>
      </Fieldset.Root>
      <Fieldset.Root>
        <Stack gap="4">
          <Fieldset.Legend fontSize="xl" fontWeight="bold">
            Amenities
          </Fieldset.Legend>

          {Object.entries(allAmenities).map(([key, val]) => (
            <AmenitiesSelection
              key={key}
              category={key}
              amenities={val}
              onChange={handleAmenityChange}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              formValues={formValues.amenities}
            />
          ))}
        </Stack>
      </Fieldset.Root>

      <Flex w="full" justifyContent="flex-end">
        <Button type="submit" loading={loading}>
          Publish listing
        </Button>
      </Flex>
    </Stack>
  );
}

ListingFormBody.propTypes = {
  listingData: PropTypes.object.isRequired,
  amenities: PropTypes.array,
  mutation: PropTypes.object.isRequired,
  listingId: PropTypes.string,
  mutationOptions: PropTypes.object.isRequired
};

function AmenitiesSelection({
  formValues,
  category,
  amenities,
  onChange,
  onSelectAll,
  onDeselectAll
}) {
  // example value for `category` -- 'ACCOMMODATION_DETAILS'
  const title = startCase(category.toLowerCase());

  const allAmenitiesInCategory = amenities.map(amenity => amenity.id);
  const overlappingAmenities = intersection(allAmenitiesInCategory, formValues);
  const allSelected = isEqual(overlappingAmenities, allAmenitiesInCategory);

  return (
    <Stack>
      <HStack mb="2">
        <Text fontWeight="bold">{title}</Text>
        <Checkbox.Root
          checked={allSelected}
          onCheckedChange={() => {
            if (allSelected) {
              onDeselectAll(allAmenitiesInCategory);
            } else {
              onSelectAll(allAmenitiesInCategory);
            }
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Select all</Checkbox.Label>
        </Checkbox.Root>
      </HStack>
      <Grid templateColumns="repeat(3, 1fr)" gap="4">
        {amenities.map(({id, name}) => (
          <Checkbox.Root
            key={id}
            checked={formValues.includes(id)}
            onCheckedChange={({checked}) => onChange(id, checked === true)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{name}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Grid>
    </Stack>
  );
}

AmenitiesSelection.propTypes = {
  category: PropTypes.string,
  amenities: PropTypes.array,
  formValues: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onDeselectAll: PropTypes.func.isRequired
};
