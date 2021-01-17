import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <BrowserRouter>
    <Auth0Provider
      domain="fazlan.auth0.com"
      clientId="KMhytaOem2bZ2BlVBuyPJlySdhijMTIa"
      redirectUri="https://managegadget.com"
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();
