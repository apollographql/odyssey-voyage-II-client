import Logo from '../assets/airlock-logo.svg';
import PropTypes from 'prop-types';
import React from 'react';
import {Avatar, Box, Button, Flex, HStack, Image, Text} from '@chakra-ui/react';
import {Link, NavLink} from 'react-router-dom';
import {useUser} from '../utils';

export default function Nav({isLight}) {
  const txtColor = isLight ? '#fff' : '#000';
  const {user} = useUser();

  return (
    <Box px="2" h="80px" bgColor="white">
      <Flex direction="row" justify="space-between" align="center" p={4}>
        <Box asChild>
          <Link to="/">
            <HStack gap="2">
              <Image
                boxSize="50px"
                objectFit="cover"
                src={Logo}
                alt="airlock logo"
              />
              <Text
                fontWeight="600"
                fontSize="2xl"
                color={txtColor}
                textTransform="uppercase"
                fontFamily="Source Sans Pro"
                letterSpacing="1.4px"
              >
                Airlock
              </Text>
            </HStack>
          </Link>
        </Box>
        <HStack gap="2">
          {user && user.__typename === 'Guest' && (
            <Button asChild variant="ghost" color={txtColor}>
              <NavLink to="/trips">My trips</NavLink>
            </Button>
          )}
          {user && user.__typename === 'Host' && (
            <Button asChild variant="ghost" color={txtColor}>
              <NavLink to="/listings">My listings</NavLink>
            </Button>
          )}
          {user && (
            <Box asChild>
              <Link to="/profile">
                <Avatar.Root borderColor="white" bg="gray.50" borderWidth="1px">
                  <Avatar.Fallback name="profile" />
                  <Avatar.Image src={user.profilePicture} />
                </Avatar.Root>
              </Link>
            </Box>
          )}
          {!user && (
            <Button asChild>
              <NavLink to="/login">Log in</NavLink>
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}

Nav.propTypes = {
  isLight: PropTypes.bool
};
