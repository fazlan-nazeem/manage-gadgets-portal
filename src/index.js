import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { AuthProvider } from "@asgardeo/auth-react";

const Index = () => (
  <AuthProvider
      config={ {
          signInRedirectURL: window.env.SIGN_IN_REDIRECT_URL,
          signOutRedirectURL: window.env.SIGN_OUT_REDIRECT_URL,
          clientID: window.env.CLIENT_ID,
          baseUrl: "https://api.asgardeo.io/t/personalfaz",
          scope: [ "openid","profile" ]
      } }
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);

ReactDOM.render(
  (<Index />),
  document.getElementById('root')
);

serviceWorker.unregister();
