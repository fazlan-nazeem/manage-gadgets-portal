import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <BrowserRouter>
    {/* <Auth0Provider
      domain="managegadget.us.auth0.com"
      clientId="exy4X0vxBn2PPeA8UJo5GH4fKUs2Zci7"
      redirectUri="https://managegadget.com"
      audience="https://api.managegadget.com"
      cacheLocation="localstorage"
    > */}
      <App />
    {/* </Auth0Provider> */}
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();
