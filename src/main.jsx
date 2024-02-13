import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import SessionProvider from './Context/session';
import SubscriberProvider from './Context/subscriber';
import { UserProvider } from './Context/user';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <UserProvider>
    <SessionProvider>
      <SubscriberProvider>
        <App />
      </SubscriberProvider>
    </SessionProvider>
  </UserProvider>
  // </React.StrictMode>
);
