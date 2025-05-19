// Polyfill for crypto.getRandomValues in Node.js
if (typeof globalThis !== 'undefined' && !globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = require('crypto').webcrypto;
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';

// Debug logs
console.log('Environment check:', {
  hasToken: !!import.meta.env.VITE_GITHUB_TOKEN,
  envKeys: Object.keys(import.meta.env),
  nodeEnv: import.meta.env.MODE
});

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </React.StrictMode>
  );
} 