// @flow
import { useState, createContext, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import OT from '@opentok/client';
import { getCredentials } from '../api/fetchCredentials';
// import RoomAPI from 'api/room';
// import CredentialAPI from 'api/credential';
// import User from 'entities/user';
const SINGAL_TYPE_CHAT = 'chat';
import useSubscriber from '../hooks/subscriber';
import LayoutManager from '../utils/layout-manager';
import { UserContext } from './user';
// import { useLayoutManager } from './layout';
export const SessionContext = createContext({});
const call = 'video-container';
function SessionProvider({ children }) {
  const [callLayout, setCalLayout] = useState(new LayoutManager(call));
  // const [callLayout, setCalLayout] = useState(useLayoutManager());
  const [subscribers, setSubscribers] = useState([]);
  const [reconnecting, setReconnecting] = useState(false);
  const [videoSources, setVideoSources] = useState([]);

  const session = useRef(null);
  //   const navigate = useNavigate();
  // const [session, setSession] = useState();
  const [messages, setMessages] = useState([{ from: 'App', text: 'You can use the chat to say something nice' }]);
  const { user } = useContext(UserContext);
  const [streams, setStreams] = useState([]);
  const [changedStream, setChangedStream] = useState();
  const [connections, setConnections] = useState([]);
  const [connected, setConnected] = useState(false);
  const [creds, setCreds] = useState({});

  const credential = {
    apiKey: '46264952',
    token:
      'T1==cGFydG5lcl9pZD00NjI2NDk1MiZzaWc9ZTRmM2FlOTYyMzY1YmIwOTBmNGE1ZmUwN2NjZDJjODVhOTRkOTYyNTpzZXNzaW9uX2lkPTJfTVg0ME5qSTJORGsxTW41LU1UY3hNamt4T0Rrd056SXpNWDV5T1dSTFdsWTRXVkpyYUVsQk5pOVdXWGhDZWxWU1RHeC1mbjQmY3JlYXRlX3RpbWU9MTcxMzUyNDEzMiZub25jZT0wLjE0MzYxODczNDEwOTQxNTA2JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE3MTQxMjg5MzEmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=',
    sessionId: '2_MX40NjI2NDk1Mn5-MTcxMjkxODkwNzIzMX5yOWRLWlY4WVJraElBNi9WWXhCelVSTGx-fn4',
  };

  // const apiKey = '46264952';
  // const sessionId = '2_MX40NjI2NDk1Mn5-MTcxMjkxODkwNzIzMX5yOWRLWlY4WVJraElBNi9WWXhCelVSTGx-fn4';
  // const token =
  //   'T1==cGFydG5lcl9pZD00NjI2NDk1MiZzaWc9M2IwZWIzNDJhMTdlZmY3MTg1MDAxODE4NGJhZGRjMTY4NmRiMzFkNTpzZXNzaW9uX2lkPTJfTVg0ME5qSTJORGsxTW41LU1UY3hNamt4T0Rrd056SXpNWDV5T1dSTFdsWTRXVkpyYUVsQk5pOVdXWGhDZWxWU1RHeC1mbjQmY3JlYXRlX3RpbWU9MTcxMjkxODkxMiZub25jZT0wLjQ4MTgxMDYzNDg4OTMxODMmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTcxMzUyMzcxMiZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';

  // useEffect(() => {
  //   getCredentials('room')
  //     .then((creds) => {
  //       console.log(creds);
  //       setCreds(creds.data);
  //     })
  //     .catch((e) => console.log(e));
  // }, []);

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

  const addMessages = (data) => {
    setMessages((prev) => [...prev, data]);
  };

  function onSignalChat({ type, data }) {
    console.log(type);
    if (type === `signal:${SINGAL_TYPE_CHAT}`) {
      const { text, username } = JSON.parse(data);
      addMessages({ text, from: `${username || '?'}`, time: new Date().toJSON().split('T')[1] });
    }
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
    // setUser(null);
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
    // const resize = createResizeObserver(subscriber);
    // resize.observe(document.getElementById(subscriber.id));
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

  function handleReconnecting() {
    console.log(user);
    if (user) {
      user.issues.reconnections++;
    }

    setReconnecting(true);
  }
  function handleReconnected() {
    setReconnecting(false);
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
        preferredResolution: 'auto',
        // insertDefaultUI: false,
        style: {
          buttonDisplayMode: 'off',
          nameDisplayMode: 'on',
        },
        showControls: false,
      });
      const subscriber = session.current.subscribe(stream, 'video-container', finalOptions);
      // subscriber.on('videoElementCreated', function (event) {
      //   const videoSource = event.element;
      //   setVideoSources((prevVideoSources) => [...prevVideoSources, videoSource]);
      // });

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
      session.current.on('sessionReconnecting', (e) => handleReconnecting(e));
      session.current.on('sessionReconnected', (e) => handleReconnected(e));
      session.current.on('sessionDisconnected', (e) => handleSessionDisconnected(e));
      session.current.on('connectionCreated', (e) => handleConnectionCreated(e));
      session.current.on('connectionDestroyed', (e) => handleConnectionDestroyed(e));
      session.current.on('signal', (e) => onSignalChat(e));

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
    // getCredentials(roomName)
    //   .then((creds) => {
    //     console.log(creds.data);
    //     connect(creds.data);
    //   })
    //   .catch((e) => console.log(e));
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
        // user,
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
        reconnecting,
        messages,
        videoSources,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
export default SessionProvider;
