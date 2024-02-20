import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Room from './pages/Room/index';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import { RoomProvider } from './Context/RoomContext';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import WaitingRoom from './components/WaitingRoom';
import UserProvider from './Context/user';
import SessionProvider from './Context/session';
import { StatsProvider } from './Context/stats';

function App() {
  return (
    <Router>
      <UserProvider>
        <SessionProvider>
          <StatsProvider>
            <Routes>
              <Route path="/waiting-room" element={<WaitingRoom />} />
              <Route path="*" element={<WaitingRoom />} />
              <Route
                path="/room"
                element={
                  <div className="">
                    <Room></Room>
                  </div>
                }
              />
            </Routes>
          </StatsProvider>
        </SessionProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
