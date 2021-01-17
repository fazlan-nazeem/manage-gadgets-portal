import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { useEffect, useState } from 'react';
import { useRoutes, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URL,
  cache: new InMemoryCache()
});

const App = () => {
  const routing = useRoutes(routes);
  const {
    loginWithRedirect,
    isAuthenticated,
    user,
    isLoading,
    error
  } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
  }

  console.log(user);

  // const [isAuth, setIsAuth] = useState(false);

  // // This client is a singleton and can be instantiated as follows.
  // const auth = IdentityClient.getInstance();

  // useEffect(() => {
  //   auth.initialize({
  //     signInRedirectURL: 'http://localhost:3000',
  //     signOutRedirectURL: 'http://localhost:3000',
  //     clientID: 'SQoHBKgqNxaj8e_NEC_kUU3LOLAa',
  //     serverOrigin: 'https://localhost:9443',

  //     endpoints: {
  //       authorize: 'https://localhost:8243/authorize',
  //       token: 'https://localhost:8243/token',
  //       jwks: 'https://localhost:9443/oauth2/jwks'
  //     }
  //   });

  //   if (!sessionStorage.getItem('loginInit')) {
  //     sessionStorage.setItem('loginInit', 'true');
  //     auth.signIn();
  //   } else {
  //     auth.signIn().then(response => {
  //       setIsAuth(true);

  //       console.log(response);
  //     });
  //   }
  // }, []);

  /**
   * Check if the page redirected by the sign-in method with authorization code,
   * if it is recall sing-in method to continue the sign-in flow
   */

  return (
    <div>
      {isAuthenticated ? (
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            {routing}
          </ThemeProvider>
        </ApolloProvider>
      ) : null}
    </div>
  );
};

export default App;
