// src/App.jsx
import React from 'react';
import { Helmet } from 'react-helmet';

import { StoreProvider } from './Store';
import Routes from './Routes';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './extra/nova-light.css';
import 'primeflex/primeflex.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import './extra/layout.css';
import './extra/blueberry-orange.css';
import './App.css';

const app_name = process.env.REACT_APP_APP_NAME;

const App = () => (
  <StoreProvider>
    <Helmet
      defaultTitle={app_name}
      titleTemplate={`%s | ${app_name}`}
      meta={[
        { name: 'title', content: 'Smart Kharcha - Track and manage your expenses on the go' },
        { name: 'description', content: 'Smart Kharcha - Track and manage your expenses on the go' },
        { name: 'keywords', content: 'Smart,Kharcha,Smart-Kharcha' },
        { name: 'og:url', content: 'https://your-domain.com' },
        { property: 'og:image', content: 'https://your-domain.com/og-image.png' }
      ]}
    />
    <Routes />
  </StoreProvider>
);

export default App;
