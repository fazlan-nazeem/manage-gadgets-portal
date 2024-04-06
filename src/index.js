import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { AuthProvider } from "@asgardeo/auth-react";

const Index = () => (
  
  <AuthProvider
      config={ {
          signInRedirectURL: "https://a304e394-1ae5-4f8e-b9c5-4a6059e6c8e5.e1-eu-north-azure.choreoapps.dev/app/dashboard",
          signOutRedirectURL: "https://a304e394-1ae5-4f8e-b9c5-4a6059e6c8e5.e1-eu-north-azure.choreoapps.dev/app/dashboard",
          clientID: "2HOMuCDCnAGKbvSSnn1SI0t48w0a",
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
