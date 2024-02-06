import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Room from './pages/Room/index';
import Test from './pages/Test';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import { RoomProvider } from './Context/RoomContext';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import WaitingRoom from './WaitingRoom';
import { UserProvider } from './Context/user';

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/waiting-room" element={<WaitingRoom />} />
          <Route
            path="/room"
            element={
              <div className="">
                <Room></Room>
                {/* <Test></Test> */}
              </div>
            }
          />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
