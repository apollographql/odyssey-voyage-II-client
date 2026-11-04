import Layout from '../layouts/Layout';
import React, {useState} from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Group,
  InputAddon,
  NumberInput,
  Stack,
  Text
} from '@chakra-ui/react';
import {gql} from '@apollo/client';
import {useMutation} from '@apollo/client/react';
import {useUser} from '../utils';

export const ADD_FUNDS = gql`
  mutation AddFunds($amount: Float!) {
    addFundsToWallet(amount: $amount) {
      code
      success
      message
      amount
    }
  }
`;

export default function Wallet() {
  const [funds, setFunds] = useState(100);
  const {user, setUser} = useUser();
  const [addFundsToWallet] = useMutation(ADD_FUNDS, {
    onCompleted: data => {
      setUser({...user, funds: data.addFundsToWallet.amount});
    }
  });

  return (
    <Layout>
      <Center textAlign="center">
        <Stack gap="4">
          <Heading as="h1">My wallet</Heading>
          <Text>
            Welcome to your wallet! Use this space to add and manage funds for
            your trips.
          </Text>
          {user && (
            <Box
              p={4}
              borderWidth="1px"
              borderColor="gray.100"
              borderRadius={4}
              textAlign="center"
            >
              <Heading size="2xl">@{user.funds}</Heading>
              <Text>credit balance</Text>
            </Box>
          )}
          <Text fontWeight="semibold" textAlign="left">
            Add funds to your account
          </Text>
          <Flex w="full">
            <Box>
              <Group attached alignSelf="center">
                <InputAddon bg="transparent" pr="0">
                  @
                </InputAddon>
                <NumberInput.Root
                  name="numOfBeds"
                  min={1}
                  value={Number.isNaN(funds) ? '' : String(funds)}
                  onValueChange={({valueAsNumber}) => {
                    setFunds(valueAsNumber);
                  }}
                >
                  <NumberInput.Control />
                  <NumberInput.Input
                    borderLeftWidth="0"
                    borderTopLeftRadius="0"
                    borderBottomLeftRadius="0"
                  />
                </NumberInput.Root>
              </Group>
            </Box>
            <Button
              alignSelf="center"
              maxW="150px"
              ml={4}
              onClick={() =>
                addFundsToWallet({
                  variables: {
                    amount: funds
                  }
                })
              }
            >
              Add funds
            </Button>
          </Flex>
        </Stack>
      </Center>
    </Layout>
  );
}
