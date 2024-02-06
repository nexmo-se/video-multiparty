import { createContext, useState, useMemo } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  var username = localStorage.getItem('username') || `User-${Date.now()}`;
  // For EC-Render clients

  const [user, setUser] = useState({
    username,
    defaultSettings: {
      publishAudio: localStorage.getItem('localAudio') === 'true',
      publishVideo: localStorage.getItem('localVideo') === 'true',
      name: username,
      blur: false,
    },
  });

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
