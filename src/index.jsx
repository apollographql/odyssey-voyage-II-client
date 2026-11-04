import App from './App';
import React from 'react';
import system from './theme';
import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import {ApolloProvider} from '@apollo/client/react';
import {ChakraProvider} from '@chakra-ui/react';
import {SetContextLink} from '@apollo/client/link/context';
import {Toaster} from './components/toaster';
import {createRoot} from 'react-dom/client';

const httpLink = new HttpLink({
  uri: import.meta.env.DEV
    ? 'http://localhost:4000'
    : import.meta.env.VITE_GQL_SERVER
});

const authLink = new SetContextLink(({headers}) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  clientAwareness: {
    name: 'web-client',
    version: '0.9'
  }
});

createRoot(document.getElementById('root')).render(
  <ChakraProvider value={system}>
    <ApolloProvider client={client}>
      <App />
      <Toaster />
    </ApolloProvider>
  </ChakraProvider>
);
