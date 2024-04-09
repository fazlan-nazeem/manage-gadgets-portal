import React from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';


let apiUrl = window?.configs?.apiUrl ? window.configs.apiUrl : "/";
if(process.env.REACT_APP_ENV == 'Development') {
  apiUrl = "http://localhost:4000/graphql"
}

const client = new ApolloClient({
  uri: apiUrl,
  cache: new InMemoryCache()
});

const App = () => {
  const routing = useRoutes(routes);

  /**
   * Check if the page redirected by the sign-in method with authorization code,
   * if it is recall sing-in method to continue the sign-in flow
   */

  return (
    <div>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            {routing}
          </ThemeProvider>
        </ApolloProvider>

    </div>
  );
};

export default App;
