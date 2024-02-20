import React from 'react';
import { useContext, useRef, useState, useEffect } from 'react';
import { Stack, Grid, IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import VideoSettings from '../../components/VideoSettings';
import AudioSettings from '../../components/AudioSettings';
import ChatSettings from '../../components/ChatSettings';
import CaptionsSettings from '../../components/CaptionsSettings';
import { SessionContext } from '../../Context/session';
import usePublisher from '../../hooks/publisher';
import useSubscriber from '../../hooks/subscriber';
import { CompressOutlined } from '@mui/icons-material';
import MoreSettings from '../../components/MoreSettings';
import MoreMenu from '../../components/MoreMenu';
import { UserContext } from '../../Context/user';
import MuteVideoButton from '../../components/MuteVideoButton';
import MuteAudioButton from '../../components/MuteAudioButton';
import MoreButton from '../../components/MoreButton';
import ScreenSharingButton from '../../components/ScreenSharingButton';
import ConnectionAlert from '../../components/ConnectionAlert';
import Chat from '../../components/Chat';
import BlurButton from '../../components/BlurButton';
import NoiseButton from '../../components/NoiseButton';
import { useMediaProcessor } from '../../hooks/mediaProcessor';
// import { useLayoutManager } from '../../Context/layout';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Room() {
  const { processor, connector } = useMediaProcessor();
  // const [layoutManager, setLayoutManager] = useState(useLayoutManager());
  const { user } = useContext(UserContext);
  const wrapRef = useRef(null);
  const resizeTimerRef = useRef();
  const mPublisher = usePublisher('video-container');
  const mSubscriber = useSubscriber({
    call: 'video-container',
  });
  const [isNoiseSuppressionEnabled, setNoiseSuppression] = useState(false);
  const mSession = useContext(SessionContext);
  const [chatOpen, setChatOpen] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);

  useEffect(() => {
    mSession.joinRoom('perro', 'jose');
  }, []);

  const handleNoiseChange = () => {
    console.log('toggling noise');
    setNoiseSuppression((prev) => !prev);
  };

  useEffect(() => {
    console.log('use effect run -toggle noise suppresion');
    console.log(isNoiseSuppressionEnabled);
    // if (OT.hasMediaProcessorSupport()) {
    if (mPublisher.publisher) {
      if (isNoiseSuppressionEnabled) {
        console.log(mPublisher.publisher);
        mPublisher.publisher
          .setAudioMediaProcessorConnector(connector)
          .catch(console.log)
          .then(console.log('setAudioMediaProcessorConnector', isNoiseSuppressionEnabled));
      } else {
        console.log('turning off NS');
        mPublisher.publisher
          .setAudioMediaProcessorConnector(null)
          .catch(console.log)
          .then(console.log('setAudioMediaProcessorConnector', isNoiseSuppressionEnabled));
      }
    } else {
      console.log('dping nothing');
      console.log(mPublisher);
    }
  }, [mPublisher.isPublishing, isNoiseSuppressionEnabled, mPublisher.publisher]);

  useEffect(() => {
    const container = document.getElementById('wrapper');

    if (container) {
      const attrObserver = new MutationObserver(function (mutations) {
        mutations.forEach((mu) => {
          console.log('calling layout');
          if (mu.type !== 'attributes' && mu.attributeName !== 'class') return;
          mSubscriber.callLayout.layout();
        });
      });
      attrObserver.observe(container, { attributes: true });
    } else {
      console.log('no container');
    }
  }, [chatOpen]);

  useEffect(() => {
    // if (container) setLayoutContainer(initLayoutContainer(container));
    if (mSubscriber.callLayout)
      window.onresize = () => {
        clearTimeout(resizeTimerRef.current);

        resizeTimerRef.current = setTimeout(function () {
          mSubscriber.callLayout.layout();
          // if (container) setLayoutContainer(initLayoutContainer(container));
        }, 100);
      };

    return () => {
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mSession.connected && !mPublisher.publisher) {
      const blur = user.defaultSettings.blur
        ? {
            videoFilter: {
              type: 'backgroundBlur',
              blurStrength: 'high',
            },
          }
        : {};

      mPublisher.publish(user.defaultSettings.name, blur);
    } else {
      return;
    }
    if (mSubscriber.callLayout) mSubscriber.callLayout.layout();
  }, [mSession.connected]);

  return (
    <Grid className="w-screen" container spacing={1}>
      <Grid ref={wrapRef} id="wrapper" height={captionsEnabled ? '80vh' : '90vh'} item xs={chatOpen ? 9 : 12}>
        <div id="video-container" className="flex column w-full h-full">
          {/* <img
            className="w-1/2"
            src="https://www.airswift.com/hubfs/Imported_Blog_Media/woman-using-video-call-etiquette-1.jpg#keepProtocol"
          />
           */}
        </div>
      </Grid>
      {chatOpen && <Chat></Chat>}
      {captionsEnabled && (
        <Grid height={'10vh p-2'} item xs={8}>
          <div className="flex row justify-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum voluptatibus voluptas totam sapiente vero dolorem eos,
            dignissimos ut labore laboriosam sint, odio earum enim praesentium amet minus laborum magnam ullam?
          </div>
        </Grid>
      )}
      <div className="flex justify-center flex-end items-center absolute h-[90px] radius-[25px] w-full bottom-[0px] left-[0px] bg-black rounded-3xl">
        <MuteVideoButton publisher={mPublisher.publisher}></MuteVideoButton>
        <MuteAudioButton publisher={mPublisher.publisher}></MuteAudioButton>
        <NoiseButton handleNoiseChange={handleNoiseChange} isNoiseSuppressionEnabled={isNoiseSuppressionEnabled}></NoiseButton>
        <ScreenSharingButton layout={mSubscriber.callLayout}></ScreenSharingButton>
        {OT.hasMediaProcessorSupport() && <BlurButton publisher={mPublisher.publisher}></BlurButton>}
        <MoreButton subStats={mSubscriber.aggregateStats} stats={mPublisher.getStats} />
        {/* <CaptionsSettings handleClick={() => setCaptionsEnabled((prev) => !prev)} /> */}
        <ChatSettings handleClick={() => setChatOpen((prev) => !prev)} />
      </div>
      {mSession.reconnecting && <ConnectionAlert message1={'Lost connection'} message2={'Please verify your network connection'} />}
      {mPublisher.quality !== 'good' && (
        <ConnectionAlert
          message1={'Video quality problem'}
          message2={'Please check your connectivity. Your video may be disabled to improve the user experience'}
        />
      )}
    </Grid>
  );
}

export default Room;
