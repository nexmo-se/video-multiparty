// @flow
import { useState, createContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import OT from '@opentok/client';
// import RoomAPI from 'api/room';
// import CredentialAPI from 'api/credential';
// import User from 'entities/user';
import useSubscriber from '../hooks/subscriber';
import LayoutManager from '../utils/layout-manager';

export const SessionContext = createContext({});
const call = 'video-container';
function SessionProvider({ children }) {
  const [callLayout, setCalLayout] = useState(new LayoutManager(call));
  const mSubscriber = useSubscriber({
    call: 'video-container',
  });

  const [subscribers, setSubscribers] = useState([]);

  const session = useRef(null);
  //   const navigate = useNavigate();
  const [user, setUser] = useState();
  // const [session, setSession] = useState();
  const [streams, setStreams] = useState([]);
  const [changedStream, setChangedStream] = useState();
  const [connections, setConnections] = useState([]);
  const [connected, setConnected] = useState(false);
  const credential = {
    apiKey: '46469012',
    token:
      'T1==cGFydG5lcl9pZD00NjQ2OTAxMiZzaWc9MjYwNTk0NWE2NGVmNzdhZjE3MzQ5YmQ5MmI0ZmYzNmQ1MWNmZjJlNjpzZXNzaW9uX2lkPTJfTVg0ME5qUTJPVEF4TW41LU1UY3dOalV6TkRNMk9URXhOMzV1UzBGcFoyeFFOMk5UUWpSU1MyeHFhbFV4Wm5odFVrMS1mbjQmY3JlYXRlX3RpbWU9MTcwNjUzNDM3OCZub25jZT0wLjczMTg2MTUyNTQ3NjM2Mjcmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTcwOTEyNjM3NyZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==',
    sessionId: '2_MX40NjQ2OTAxMn5-MTcwNjUzNDM2OTExN35uS0FpZ2xQN2NTQjRSS2xqalUxZnhtUk1-fn4',
  };

  useEffect(() => {
    try {
      if (document.getElementById(call)) callLayout.layout();
    } catch (err) {
      console.log(err.stack);
    }
  }, [subscribers]);

  function handleStreamPropertyChanged({ stream, changedProperty, newValue, oldValue }) {
    setChangedStream({ stream, changedProperty, newValue, oldValue, token: uuid() });
  }

  function handleConnectionCreated(e) {
    setConnections((prevConnections) => [...prevConnections, e.connection]);
  }

  function handleConnectionDestroyed(e) {
    setConnections((prevConnections) => [...prevConnections].filter((connection) => connection.id !== e.connection.id));
  }

  const createResizeObserver = (subscriber) => {
    console.log('creating observer');
    const resizeObserver = new ResizeObserver(function (entries) {
      // since we are observing only a single element, so we access the first element in entries array
      let rect = entries[0].contentRect;

      console.log('Current Width : ' + rect.width);
      console.log('Current Height : ' + rect.height);
      subscriber.setPreferredResolution({
        width: rect.width,
        height: rect.height,
      });

      // current width & height
      // width.current = rect.width;
      // height.current = rect.height;
    });
    return resizeObserver;
  };

  function handleSessionDisconnected(e) {
    setConnections([]);
    // setSession(null);
    session.current = null;
    setUser(null);
    setConnected(false);
  }

  function handleStreamCreated(e) {
    console.log('stream Created');

    subscribe(e.stream, session);
    // mSubscriber.subscribe(e.stream, session);
    setStreams((prevStreams) => [...prevStreams, e.stream]);
  }

  const addSubscribers = ({ subscriber }) => {
    setSubscribers((prev) => [...prev, subscriber]);
    const resize = createResizeObserver(subscriber);
    resize.observe(document.getElementById(subscriber.id));
  };

  const removeSubscribers = ({ subscriber }) => {
    setSubscribers((prev) => prev.filter((prevSub) => prevSub.id !== subscriber.id));
  };

  function handleStreamDestroyed(e) {
    setStreams((prevStreams) => [...prevStreams].filter((stream) => stream.id !== e.stream.id));
    session.current.getSubscribersForStream(e.stream).forEach((subscriber) => {
      removeSubscribers({ subscriber });
    });
  }

  function insertPinIcon(targetSubscriber) {
    const childNodeStr = `<button 
    id="speakerPin-${targetSubscriber.id}"
    style="
    position: absolute; 
    top: 8px; 
    right: 8px;
    background: url('https://www.svgrepo.com/show/31706/map-pin.svg');
    background-position: center;
    background-size: contain;
    height: 18px;
    width: 18px;
    background-repeat: no-repeat;">
    </button>`;
    targetSubscriber.insertAdjacentHTML('beforeend', childNodeStr);
  }

  async function subscribe(stream, session, options = {}) {
    console.log('request to subscribe');
    if (session) {
      console.log(session);
      const finalOptions = Object.assign({}, options, {
        insertMode: 'append',
        width: '100%',
        height: '100%',
        style: {
          buttonDisplayMode: 'off',
          nameDisplayMode: 'on',
        },
        showControls: false,
      });
      const subscriber = session.current.subscribe(stream, 'video-container', finalOptions);
      const element = subscriber.element;
      if (stream.videoType === 'screen') {
        element.classList.add('OT_big');
      }

      insertPinIcon(element);
      const pinEl = document.getElementById(`speakerPin-${element.id}`);
      pinEl.addEventListener('click', function () {
        if (element.classList.contains('OT_big')) {
          element.classList.remove('OT_big');
        } else {
          element.classList.add('OT_big');
        }
        callLayout.layout();
      });
      addSubscribers({ subscriber });
      // setCallSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    }
  }

  async function connect(credential) {
    try {
      session.current = OT.initSession(credential.apiKey, credential.sessionId);
      // let newSession = OT.initSession(credential.apiKey, credential.sessionId);
      // setSession(newSession);
      let newSession = session.current;

      session.current.on('streamPropertyChanged', handleStreamPropertyChanged);
      session.current.on('streamCreated', (e) => handleStreamCreated(e));
      session.current.on('streamDestroyed', (e) => handleStreamDestroyed(e));
      session.current.on('sessionDisconnected', (e) => handleSessionDisconnected(e));
      session.current.on('connectionCreated', (e) => handleConnectionCreated(e));
      session.current.on('connectionDestroyed', (e) => handleConnectionDestroyed(e));

      await new Promise((resolve, reject) => {
        session.current.connect(credential.token, (err) => {
          if (err) reject(err);
          else {
            setConnected(true);
            resolve();
          }
        });
      });
      const userData = JSON.parse(session.current.connection.data);
      //   const newUser = new User(userData.name, userData.role, newSession.connection.id);
      //   setUser(newUser);
      console.log('session: ', session.current);
    } catch (err) {
      console.log(err);
    }
  }

  async function joinRoom(roomName, user) {
    // setUser(user);
    // const newRoom = await RoomAPI.createSession(roomName);
    // const credential = await CredentialAPI.generateCredential({ sessionId: newRoom.sessionId, role: 'publisher', data: user });
    connect(credential);
  }

  async function disconnect() {
    if (session.current) {
      session.current.disconnect();
      setSession(null);
      setConnected(false);
    }
    // navigate('/');
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        subscribe,
        session: session.current,
        streams,
        changedStream,
        connections,
        connect,
        disconnect,
        joinRoom,
        connected,
        subscribers,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
export default SessionProvider;
