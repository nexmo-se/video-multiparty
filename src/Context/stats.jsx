// @flow
import { useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import OT from '@opentok/client';
import OTStats from '../utils/stats';
// import RoomAPI from 'api/room';
// import CredentialAPI from 'api/credential';
// import User from 'entities/user';

export const StatsContext = createContext({});
function StatsProvider({ children }) {
  //   const navigate = useNavigate();
  const [user, setUser] = useState();
  const [session, setSession] = useState();
  const [streams, setStreams] = useState([]);
  const [changedStream, setChangedStream] = useState();
  const [connections, setConnections] = useState([]);
  const [connected, setConnected] = useState(false);

  return (
    <StatsContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}
export default StatsProvider;
