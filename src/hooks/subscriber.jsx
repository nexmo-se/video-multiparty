// @flow
// import { MessageContext } from 'contexts/message';
import { SessionContext } from '../Context/session';
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import LayoutManager from '../utils/layout-manager';
import { SubscriberContext } from '../Context/subscriber';
import { useStatsContext } from '../Context/stats';

function useSubscriber({ call, monitor }) {
  const stats = useStatsContext();
  // const stats = useRef(null);

  const [subscribed, setSubscribed] = useState([]);
  const [monitoringStats, setMonitoringStats] = useState(false);
  const [callSubscribers, setCallSubscribers] = useState([]);
  const [monitorSubscribers, setMonitorSubscribers] = useState([]);
  const [monitorSubscribersAudioVolume, setMonitorSubscribersAudioVolume] = useState([]);
  const [soloAudioSubscriber, setSoloAudioSubscriber] = useState();

  const [loudestSubscriber, setLoudestSubscriber] = useState();
  const [callLayout, setCalLayout] = useState(new LayoutManager(call));
  const [monitorLayout, setMonitorLayout] = useState(new LayoutManager(monitor));
  const mSession = useContext(SessionContext);
  const [aggregateStats, setAggregateStats] = useState(null);

  useEffect(() => {
    if (!mSession.subscribers) return;
    if (mSession.subscribers.length > 0 && stats) {
      stats.stop();

      stats.setOnAggregateStatsAvailableListener(handleAggregateStatsListener);
      stats.setSubscriberOnStatsAvailableListener(onSubscriberStatsAvailable);

      console.log('adding sub');
      mSession.subscribers.forEach((sub) => stats.addSubscriber(sub));
      stats.start();
    }
  }, [mSession.subscribers]);

  function insertMuteIcon(targetSubscriber, targetDom) {
    if (document.getElementById(`${targetSubscriber.id}-mute`)) return;
    const childNodeStr = `<div
    id=${targetSubscriber.id}-mute
    style="
    position: absolute; 
    bottom: 8px; 
    right: 8px;
    background: url('https://cdn-icons-png.flaticon.com/512/107/107037.png');
    background-position: center;
    background-size: contain;
    height: 18px;
    width: 18px;
    background-repeat: no-repeat;">
    </div>`;
    targetDom.insertAdjacentHTML('beforeend', childNodeStr);
  }

  function handleAudioLevelChange(e) {
    setMonitorSubscribersAudioVolume((prev) => {
      // check if it is monitor subscriber
      const targetElemet = document.getElementById(e.target.id);
      if (targetElemet && targetElemet.closest('.layoutContainer').getAttribute('id') !== 'monitorContainer') return prev;
      const subscriberIndex = prev.findIndex((subscriber) => subscriber.id === e.target.id);
      let sortedSubscribers;
      if (subscriberIndex !== -1) {
        prev[subscriberIndex].audioLevel = e.audioLevel;
        sortedSubscribers = prev.sort((a, b) => (a.audioLevel < b.audioLevel ? 1 : -1));
      } else {
        const data = {
          id: e.target.id,
          subscriber: e.target,
          audioLevel: e.audioLevel,
        };
        sortedSubscribers = [...prev, data].sort((a, b) => (a.audioLevel < b.audioLevel ? 1 : -1));
      }
      // filter hidden subscriber
      let monitorContainer = document.getElementsByClassName('monitorContainer')[0];
      let inCallSubscriberId;
      if (monitorContainer) {
        for (let dom of monitorContainer.getElementsByClassName('OT_root')) {
          if (dom.style.display === 'none') inCallSubscriberId = dom.id;
        }
      }

      if (inCallSubscriberId) sortedSubscribers = sortedSubscribers.filter((subscriber) => subscriber.id !== inCallSubscriberId);

      setLoudestSubscriber((prev) => {
        if (!prev || (sortedSubscribers.length > 0 && sortedSubscribers[0].audioLevel > 0.05)) return sortedSubscribers[0];
        else return prev;
      });
      return sortedSubscribers;
    });
  }

  function handleAggregateStatsListener(stats) {
    setAggregateStats(stats);
    console.log(stats);
  }
  function onSubscriberStatsAvailable(stats) {
    console.log(stats);
  }

  // async function subscribeSingleStream(stream) {
  //   if (!stream) return;
  //   const subscriberOptions = {
  //     insertMode: 'append',
  //     style: {
  //       buttonDisplayMode: 'off',
  //       nameDisplayMode: 'on',
  //     },
  //   };
  //   let containerId = call;
  //   // if (mMessage.requestCall && mMessage.requestCall.id === stream.connection.id) {
  //   //   containerId = call;
  //   // }
  //   const subscriber = await new Promise((resolve, reject) => {
  //     const subscriber = mSession.session.subscribe(stream, 'video-container', subscriberOptions, (err) => {
  //       if (!err) {
  //         //   if (!stream.hasAudio) {
  //         const targetDom = document.getElementById(subscriber.id);
  //         insertMuteIcon(subscriber, targetDom);
  //         //   }
  //         resolve(subscriber);
  //       } else {
  //         console.log('subscribe error', err);
  //         console.log('subscribe stream', stream);
  //       }
  //     });
  //   });
  //   // stats.current.addSubscriber(subscriber);
  //   // if (mSession.user.role === "nurse")  {
  //   //   subscriber.on("audioLevelUpdated", handleAudioLevelChange)
  //   // }
  //   if (containerId === call) {
  //     setCallSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
  //   }
  //   // if (containerId === monitor) {
  //   //   setMonitorSubscribers((prevSubscribers) => [ ...prevSubscribers, subscriber ]);
  //   // }
  // }

  // async function subscribe(stream, session, options = {}) {
  //   console.log('request to subscribe');
  //   if (session) {
  //     console.log(session);
  //     const finalOptions = Object.assign({}, options, {
  //       insertMode: 'append',
  //       width: '100%',
  //       height: '100%',
  //       style: {
  //         buttonDisplayMode: 'off',
  //         nameDisplayMode: 'on',
  //       },
  //       showControls: false,
  //     });
  //     const subscriber = session.current.subscribe(stream, 'video-container', finalOptions);
  //     setCallSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
  //   } else {
  //     console.log(session);
  //   }
  // }
  // [mSession.session]
  // );

  //   useEffect(() => {
  //     if (!mSession.user || mSession.user.role !== 'nurse') return;

  //     let prevLoudestDom = document.getElementsByClassName('loudest')[0];

  //     if (!loudestSubscriber) {
  //       return;
  //     }

  //     let currentLoudestDom = document.getElementById(loudestSubscriber.id);
  //     let targetId = loudestSubscriber.id;
  //     if (soloAudioSubscriber) {
  //       currentLoudestDom = document.getElementById(soloAudioSubscriber.id);
  //       targetId = soloAudioSubscriber;
  //     }

  //     if (prevLoudestDom && prevLoudestDom.id === targetId) return;
  //     if (prevLoudestDom) prevLoudestDom.classList.remove('loudest');
  //     if (currentLoudestDom && !currentLoudestDom.classList.contains('loudest')) currentLoudestDom.classList.add('loudest');
  //   }, [loudestSubscriber, mSession.user, mMessage.requestCall, soloAudioSubscriber]);

  //   useEffect(() => {
  //     if (!mSession.user || mSession.user.role !== 'nurse') return;
  //     let prevMissingSubscriberDom = document.querySelectorAll('.missing');
  //     // Get corresponding subscriber ids
  //     const missingSubscribers = monitorSubscribers.filter((subscriber) =>
  //       mMessage.missingUsers.find((user) => {
  //         return user.id === subscriber.stream.connection.id;
  //       })
  //     );

  //     prevMissingSubscriberDom.forEach((subscriberDom) => {
  //       // find corresponding monitor subscriber id
  //       if (!missingSubscribers.find((subscriber) => subscriberDom.id === subscriber.id)) {
  //         subscriberDom.classList.remove('missing');
  //       }
  //     });

  //     missingSubscribers.forEach((subscriber) => {
  //       let missingUserDom = document.getElementById(subscriber.id);
  //       if (missingUserDom && !missingUserDom.classList.contains('missing')) missingUserDom.classList.add('missing');
  //     });
  //   }, [mSession.user, mMessage.missingUsers, monitorSubscribers]);

  function unsubscribe() {
    callSubscribers.forEach((subscriber) => {
      if (subscriber.stream) mSession.session.unsubscribe(subscriber);
    });
    monitorSubscribers.forEach((subscriber) => {
      if (subscriber.stream) mSession.session.unsubscribe(subscriber);
    });
    setCallSubscribers([]);
    setMonitorSubscribers([]);
    setSubscribed([]);
  }

  //   async function subscribeSingleStream(stream) {
  //     if (!stream) return;
  //     const subscriberOptions = {
  //       insertMode: 'append',
  //       style: {
  //         buttonDisplayMode: 'off',
  //         nameDisplayMode: 'on',
  //       },
  //     };

  //     const subscriber = await new Promise((resolve, reject) => {
  //       const subscriber = mSession.session.subscribe(stream, containerId, subscriberOptions, (err) => {
  //         if (!err) {
  //           if (!stream.hasAudio) {
  //             const targetDom = document.getElementById(subscriber.id);
  //             insertMuteIcon(subscriber, targetDom);
  //           }
  //           resolve(subscriber);
  //         } else {
  //           console.log('subscribe error', err);
  //           console.log('subscribe stream', stream);
  //         }
  //       });
  //     });
  //     if (mSession.user.role === 'nurse') {
  //       subscriber.on('audioLevelUpdated', handleAudioLevelChange);
  //     }
  //     if (containerId === call) {
  //       setCallSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
  //     }
  //     if (containerId === monitor) {
  //       setMonitorSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
  //     }
  //   }

  // async function subscribe(streams) {
  //   console.log(streams);
  //   setSubscribed(streams);

  //   const streamIDs = streams.map((stream) => stream.id);
  //   const subscribedIDs = subscribed.map((stream) => stream.id);

  //   const newStreams = streams.filter((stream) => !subscribedIDs.includes(stream.id));
  //   const removedStreams = subscribed.filter((stream) => !streamIDs.includes(stream.id));

  //   removedStreams.forEach((stream) => {
  //     setCallSubscribers((prevSubscribers) => {
  //       return prevSubscribers.filter((subscriber) => {
  //         return !!subscriber.stream;
  //       });
  //     });
  //   });

  //   await Promise.all(
  //     newStreams.map(async (stream) => {
  //       subscribeSingleStream(stream);
  //     })
  //   );
  // }

  // useEffect(() => {
  //   try {
  //     if (document.getElementById(call)) callLayout.layout();
  //   } catch (err) {
  //     console.log(err.stack);
  //   }
  // }, [callSubscribers, monitorSubscribers, callLayout, monitorLayout, call]);

  return {
    // subscribe,
    // subscribeSingleStream,
    unsubscribe,
    // callSubscribers,
    monitorSubscribers,
    callLayout,
    monitorLayout,
    soloAudioSubscriber,
    loudestSubscriber,
    // updateSoloAudioSubscriber,
    // updateMuteIconVisibility,
    aggregateStats,
  };
}
export default useSubscriber;
