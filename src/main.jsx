import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import SessionProvider from './Context/session';
import SubscriberProvider from './Context/subscriber';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <SessionProvider>
    <SubscriberProvider>
      <App />
    </SubscriberProvider>
  </SessionProvider>
  // </React.StrictMode>
);
