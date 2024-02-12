import React from 'react';
import { useContext, useRef, useState, useEffect } from 'react';
import { Stack, Grid, IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import VideoSettings from '../../VideoSettings';
import AudioSettings from '../../AudioSettings';
import ChatSettings from '../../ChatSettings';
import CaptionsSettings from '../../CaptionsSettings';
import { SessionContext } from '../../Context/session';
import usePublisher from '../../hooks/publisher';
import useSubscriber from '../../hooks/subscriber';
import { CompressOutlined } from '@mui/icons-material';
import MoreSettings from '../../MoreSettings';
import MoreMenu from '../../MoreMenu';
import { UserContext } from '../../Context/user';
import MuteVideoButton from '../../MuteVideoButton';
import MuteAudioButton from '../../MuteAudioButton';
import MoreButton from '../../MoreButton';
import ScreenSharingButton from '../../ScreenSharingButton';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Room() {
  const { user } = useContext(UserContext);
  const wrapRef = useRef(null);
  const resizeTimerRef = useRef();
  const mPublisher = usePublisher('video-container');
  const mSubscriber = useSubscriber({
    call: 'video-container',
  });
  const mSession = useContext(SessionContext);
  const [chatOpen, setChatOpen] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);

  useEffect(() => {
    mSession.joinRoom('perro', 'jose');
  }, []);

  // useEffect(() => {
  //   mSubscriber.subscribe(mSession.streams);
  //   if (mSubscriber.callLayout) mSubscriber.callLayout.layout();
  // }, [mSession.streams]);

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
          <img
            className="w-1/2"
            src="https://www.airswift.com/hubfs/Imported_Blog_Media/woman-using-video-call-etiquette-1.jpg#keepProtocol"
          />
          <img
            className="w-1/2"
            src="https://www.airswift.com/hubfs/Imported_Blog_Media/woman-using-video-call-etiquette-1.jpg#keepProtocol"
          />
          <img
            className="w-1/2"
            src="https://www.airswift.com/hubfs/Imported_Blog_Media/woman-using-video-call-etiquette-1.jpg#keepProtocol"
          />
          <img
            className="w-1/2"
            src="https://www.airswift.com/hubfs/Imported_Blog_Media/woman-using-video-call-etiquette-1.jpg#keepProtocol"
          />
          <img
            className="w-1/2"
            src="https://www.airswift.com/hubfs/Imported_Blog_Media/woman-using-video-call-etiquette-1.jpg#keepProtocol"
          />
          <img
            className="w-1/2"
            src="https://www.airswift.com/hubfs/Imported_Blog_Media/woman-using-video-call-etiquette-1.jpg#keepProtocol"
          /> */}
        </div>
      </Grid>
      {chatOpen && (
        <Grid height={'80vh'} item xs={3}>
          <Item>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit, unde ad distinctio optio nostrum aliquam illo animi quas hic
            repellat, placeat, explicabo quam labore perspiciatis libero commodi esse vero quae! distinctio optio nostrum aliquam illo animi
            quas hic repellat, placeat, explicabo quam labore perspiciatis libero commodi esse vero quae!distinctio optio nostrum aliquam
            illo animi quas hic repellat, placeat, explicabo quam labore perspiciatis libero commodi esse vero quae!
          </Item>
          <Item>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit, unde ad distinctio optio nostrum aliquam illo animi quas hic
            repellat, placeat, explicabo quam labore perspiciatis libero commodi esse vero quae!
          </Item>
        </Grid>
      )}
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
        <ScreenSharingButton layout={mSubscriber.callLayout}></ScreenSharingButton>
        <MoreButton subStats={mSubscriber.aggregateStats} rtcStats={mPublisher.getRtcStats} stats={mPublisher.getStats} />
        {/* <CaptionsSettings handleClick={() => setCaptionsEnabled((prev) => !prev)} /> */}
        <ChatSettings handleClick={() => setChatOpen((prev) => !prev)} />
      </div>
    </Grid>
  );
}

export default Room;
