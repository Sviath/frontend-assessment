import React from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { LayoutWrapper } from './LayoutWrapper';
import { useGlobalBodyStyles } from './hooks/useGlobalBodyStyles';
import { HomePage } from './screens/HomePage';
import { PokemonDetailsPage } from './screens/PokemonDetailsPage';
import { PokemonListPage } from './screens/PokemonListPage';

const PokemonListPageWithDetails = () => (
  <>
    <PokemonListPage />
    <PokemonDetailsPage />
  </>
);

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graphql.pokeapi.co/v1beta2',
  }),
  cache: new InMemoryCache(),
});

const App = () => {
  useGlobalBodyStyles();

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutWrapper />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/list" element={<PokemonListPage />} />
            <Route path="/pokemon/:id" element={<PokemonListPageWithDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
