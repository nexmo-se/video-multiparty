// @flow
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import LayoutManager from '../utils/layout-manager';
import OT from '@opentok/client';
import OTStats from '../utils/stats';
// import delay from 'delay';
import { SessionContext } from '../Context/session';
import { getInitials } from '../util';
import { UserContext } from '../Context/user';

function usePublisher(containerId, displayName = true) {
  const DFT_PUBLISHER_OPTIONS = {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    // fitMode: 'contain',
  };
  const { user } = useContext(UserContext);
  //   const OTStats = useRef(null);
  const publisher = useRef(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publisherOptions, setPublisherOptions] = useState();
  const [stream, setStream] = useState();
  const [layoutManager, setLayoutManager] = useState(new LayoutManager(containerId));
  const mSession = useContext(SessionContext);
  const stats = OTStats();
  const [simulcastLayers, setSimulcastLayers] = useState(null);
  const [getStats, setStats] = useState(null);
  function handleDestroyed() {
    publisher.current = null;
  }

  function onPublisherStatsAvailable(id, video, audio, rtcStats) {
    // console.log(rtcStats);
    setStats({ ...video, ...rtcStats, ...audio });

    // document.getElementById(id+"lbl").innerHTML = video.width+"x"+video.height+"@"+video.frameRate+"fps<br/>VBW:"+video.bandwidth+"Kbps PL:"+video.packetLoss+"%<br/>ABW:"+audio.bandwidth+"Kbps PL:"+audio.packetLoss+"%";
  }

  function handleStreamCreated(e) {
    console.log(e.target.id);
    insertWifiIcon(e.target.id, e.target.element);
    setStream(e.stream);
  }

  function handleStreamDestroyed(e) {
    setStream(null);
    if (publisher) publisher.current.destroy();
    publisher.current = null;
  }

  function handleAccessDenied() {
    if (publisher.current) publisher.current.destroy();
    publisher.current = null;
  }

  async function unpublish() {
    if (publisher) {
      mSession.session.unpublish(publisher.current);
    }
  }

  const getRtcStats = useCallback(async () => {
    if (publisher.current) {
      let prevTimeStamp = null;
      let protocol = null;
      let prevPacketsSent = null;
      let connectionType = null;
      let prevBytesSent = null;
      let simulcastLayers = [];
      try {
        const stats = await publisher.current.getRtcStatsReport();

        // setRtt([]);
        stats[0].rtcStatsReport.forEach((e) => {
          if (e.type === 'local-candidate') {
            if (e.networkType === 'vpn') setHasVPN(true);
            connectionType = e.networkType;
            // setConnectionType(e.networkType);
            if (e.candidateType === 'relay') {
              //   setProtocol(`TURN ${e.relayProtocol}`);
              protocol = `TURN ${e.relayProtocol}`;
              //   setIp({ ip: e.ip, type: 'relay' });
            } else {
              protocol = e.protocol;
              //   setProtocol(e.protocol);
            }
          }

          if (e.type === 'outbound-rtp' && e.kind === 'video' && e.frameHeight && e.frameWidth && e.bytesSent) {
            // Rest of the loop for subsequent iterations

            const newLayers = {
              width: e.frameWidth,
              height: e.frameHeight,
              framesPerSecond: e.framesPerSecond,
              qualityLimitationReason: e.qualityLimitationReason,
              id: e.ssrc,
            };

            simulcastLayers = [...simulcastLayers, newLayers];
          }
        });

        return {
          simulcastLayers,
          protocol,
        };

        /* setIsScreenSharing(true); */
      } catch (e) {
        console.log('[useRtcStats] -  error:', e);
      }
    }
  }, [publisher.current]);

  function insertWifiIcon(targetSubscriber, targetDom) {
    if (document.getElementById(`${targetSubscriber.id}-mute`)) return;
    const childNodeStr = `<div
    id=${targetSubscriber.id}-mute
    style="
    position: absolute; 
    top: 8px; 
    right: 8px;
    background: url('https://purepng.com/public/uploads/large/purepng.com-wifi-icon-greenwifi-iconwifiiconwireless-connection-170152843620015a2q.png');
    background-position: center;
    background-size: contain;
    height: 28px;
    width: 28px;
    background-repeat: no-repeat;">
    </div>`;
    targetDom.insertAdjacentHTML('beforeend', childNodeStr);
  }

  const initPublisher = useCallback((container, publisherOptions) => {
    console.log(publisherOptions);
    if (publisher.current) {
      console.log(' - initPublisher - already initiated');
      return;
    }
    const finalPublisherOptions = Object.assign({}, DFT_PUBLISHER_OPTIONS, publisherOptions);
    // console.log(finalPublisherOptions)

    const publ = OT.initPublisher(container, finalPublisherOptions, (err) => {
      if (err) {
        publisher.current = null;
        if (err.name === 'OT_USER_MEDIA_ACCESS_DENIED') return;
        console.log(' - initPublisher err', err);
        return;
      }
      console.log('pub initialised');
    });

    publisher.current = publ;
  }, []);

  const destroyPublisher = () => {
    if (publisher.current) {
      console.log('destroying it ');
      publisher.current.destroy();
      publisher.current = null;
    } else {
      console.log('pub not destroyed');
    }
  };

  async function publishAttempt(publisher, attempt = 1, noRetry = true) {
    console.log(`Attempting to publish in ${attempt} try`);
    console.log(publisher);
    if (attempt > 1) {
      publisher = OT.initPublisher(containerId, publisherOptions);
    }

    publisher.on('destroyed', handleDestroyed);
    publisher.on('streamCreated', handleStreamCreated);
    publisher.on('streamDestroyed', handleStreamDestroyed);
    publisher.on('accessDenied', handleAccessDenied);

    const { retry, error } = await new Promise((resolve, reject) => {
      mSession.session.publish(publisher, (err) => {
        if (err && noRetry) {
          resolve({ retry: undefined, error: err });
        }
        if (err && attempt < 3) {
          resolve({ retry: true, error: err });
        }
        if (err && attempt >= 3) {
          resolve({ retry: false, error: err });
        } else resolve({ retry: false, error: undefined });
      });
    });

    if (retry) {
      // Wait for 2 seconds before attempting to publish again
      await delay(2000 * attempt);
      await publishAttempt(publisher.current, attempt + 1);
    } else if (error) {
      if (noRetry) return;
      alert(`
      We tried to access your camera/mic 3 times but failed. 
      Please make sure you allow us to access your camera/mic and no other application is using it.
      You may refresh the page to retry`);
      mSession.disconnect();
      setIsPublishing(false);
      publisher.current = null;
    } else {
      setIsPublishing(false);
      publisher.current = publisher;
    }
  }

  async function publish(name, extraData) {
    try {
      if (!mSession.session) throw new Error('You are not connected to session');
      setIsPublishing(true);
      console.log(extraData);

      // if (!publishAttempt) {
      console.log('cutimba');
      const options = {
        insertMode: 'append',
        name: name,
        publishAudio: user.defaultSettings.publishAudio,
        publishVideo: user.defaultSettings.publishVideo,
        initials: getInitials(name),
        style: {
          buttonDisplayMode: 'off',
          nameDisplayMode: displayName ? 'on' : 'off',
        },
      };
      const finalOptions = Object.assign({}, options, extraData);
      setPublisherOptions(finalOptions);
      const newPublisher = OT.initPublisher(containerId, finalOptions);

      stats.addPublisher(newPublisher);
      stats.setPublisherOnStatsAvailableListener(onPublisherStatsAvailable);
      stats.start();

      publishAttempt(newPublisher, 1);
      publisher.current = newPublisher;
      // } else {
      //   publishAttempt(publisher.current);
      // }
    } catch (err) {
      console.log(err.stack);
    }
  }

  useEffect(() => {
    try {
      if (document.getElementById(containerId)) layoutManager.layout();
    } catch (err) {
      console.log(err.stack);
    }
  }, [publisher.current, stream, layoutManager, containerId]);

  return {
    isPublishing,
    unpublish,
    publish,
    publisher: publisher.current,
    getStats,
    getRtcStats,
    simulcastLayers,
    initPublisher,
    destroyPublisher,
  };
}
export default usePublisher;
