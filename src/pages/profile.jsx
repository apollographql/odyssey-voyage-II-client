import Layout from '../layouts/Layout';
import React, {useRef} from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Stack,
  Text,
  Textarea,
  VStack
} from '@chakra-ui/react';
import {IoCheckmark, IoExit, IoWallet} from 'react-icons/io5';
import {Link} from 'react-router-dom';
import {gql} from '@apollo/client';
import {useApolloClient, useMutation} from '@apollo/client/react';
import {useUser} from '../utils';

export const UPDATE_PROFILE = gql`
  mutation UpdateUserProfile($updateProfileInput: UpdateProfileInput) {
    updateProfile(updateProfileInput: $updateProfileInput) {
      code
      success
      message
      user {
        id
        name
        profilePicture
        ... on Host {
          profileDescription
        }
      }
    }
  }
`;

export default function Profile() {
  const {user, setUser} = useUser();
  const txtProfileDescRef = useRef();
  const client = useApolloClient();
  const [updateProfileData, {loading, error}] = useMutation(UPDATE_PROFILE, {
    onCompleted: data => {
      setUser({...data.updateProfile.user});
      const {profileDescription} = data.updateProfile.user;

      if (user.__typename === 'Host') {
        txtProfileDescRef.current.value = profileDescription;
      }
    }
  });

  if (error) return `Submission error! ${error.message}`;

  return (
    <Layout containerSize="breakpoint-lg">
      <Center>
        {user && (
          <VStack gap="3" textAlign="center">
            <Heading as="h2">My profile</Heading>
            <Image
              boxSize="200px"
              objectFit="cover"
              src={user.profilePicture}
              alt="profile picture"
            />
            <Stack>
              <Text fontWeight="bold" fontSize="lg">
                {user.name}{' '}
                <Text
                  as="span"
                  textTransform="uppercase"
                  fontWeight="normal"
                  fontSize="sm"
                >
                  ({user.__typename})
                </Text>
              </Text>
            </Stack>
            {user.__typename === 'Host' && (
              <Box>
                <Text mb="1" fontWeight="bold" alignSelf="flex-start">
                  About
                </Text>
                <Textarea
                  ref={txtProfileDescRef}
                  placeholder="Profile description"
                  defaultValue={user.profileDescription}
                  width="400px"
                />
              </Box>
            )}
            <Stack direction="row" gap="2">
              {user.__typename === 'Host' && (
                <Button
                  onClick={() => {
                    const updateProfileInput = {
                      profileDescription: txtProfileDescRef?.current.value
                    };
                    return updateProfileData({
                      variables: {
                        updateProfileInput
                      }
                    }).catch(() => {});
                  }}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                  <IoCheckmark />
                </Button>
              )}
              {user.__typename === 'Guest' && (
                <Box>
                  <Button asChild>
                    <Link to="/wallet">
                      Go to wallet
                      <IoWallet />
                    </Link>
                  </Button>
                </Box>
              )}
              <Button
                asChild
                onClick={() => {
                  localStorage.removeItem('token');
                  setUser({user: null});
                  client.clearStore();
                }}
                variant="outline"
              >
                <Link to="/login">
                  Logout
                  <IoExit />
                </Link>
              </Button>
            </Stack>
          </VStack>
        )}
      </Center>
    </Layout>
  );
}
