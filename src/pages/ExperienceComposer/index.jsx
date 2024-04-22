import React, { useEffect, useRef } from 'react';
import video from '../../../public/test.mp4';
const ExperienceComposer = () => {
  //   const API_KEY = '46264952';
  // const SESSION_ID = '2_MX40NjI2NDk1Mn5-MTcxMjkxODkwNzIzMX5yOWRLWlY4WVJraElBNi9WWXhCelVSTGx-fn4';
  // const TOKEN =
  //   'T1==cGFydG5lcl9pZD00NjI2NDk1MiZzaWc9M2IwZWIzNDJhMTdlZmY3MTg1MDAxODE4NGJhZGRjMTY4NmRiMzFkNTpzZXNzaW9uX2lkPTJfTVg0ME5qSTJORGsxTW41LU1UY3hNamt4T0Rrd056SXpNWDV5T1dSTFdsWTRXVkpyYUVsQk5pOVdXWGhDZWxWU1RHeC1mbjQmY3JlYXRlX3RpbWU9MTcxMjkxODkxMiZub25jZT0wLjQ4MTgxMDYzNDg4OTMxODMmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTcxMzUyMzcxMiZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';
  const videoRef = useRef();
  console.log(videoRef);
  console.log(video);

  const apiKey = '46264952';
  const sessionId = '2_MX40NjI2NDk1Mn5-MTcxMjkxODkwNzIzMX5yOWRLWlY4WVJraElBNi9WWXhCelVSTGx-fn4';
  const token =
    'T1==cGFydG5lcl9pZD00NjI2NDk1MiZzaWc9ZTRmM2FlOTYyMzY1YmIwOTBmNGE1ZmUwN2NjZDJjODVhOTRkOTYyNTpzZXNzaW9uX2lkPTJfTVg0ME5qSTJORGsxTW41LU1UY3hNamt4T0Rrd056SXpNWDV5T1dSTFdsWTRXVkpyYUVsQk5pOVdXWGhDZWxWU1RHeC1mbjQmY3JlYXRlX3RpbWU9MTcxMzUyNDEzMiZub25jZT0wLjE0MzYxODczNDEwOTQxNTA2JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE3MTQxMjg5MzEmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=';
  let videoEl;
  let connected = false;

  const handleError = (error) => {
    console.error(error);
  };

  const initializeSession = async () => {
    console.log(videoEl);

    const stream = videoRef.current.captureStream();
    const session = OT.initSession(apiKey, sessionId);

    await new Promise((res, rej) => {
      session.connect(token, (error) => {
        if (error) {
          rej(error);
        } else {
          connected = true;
          res();
        }
      });
    });

    const publisher = initPublisher(stream);
    await publish(publisher, session, stream);
    const publisher_2 = initPublisher(stream);
    console.log(publisher_2);
    await publish(publisher_2, session, stream);
    const publisher_3 = initPublisher(stream);
    await publish(publisher_3, session, stream);
    const publisher_4 = initPublisher(stream);
    await publish(publisher_4, session, stream);
    const publisher_5 = initPublisher(stream);
    await publish(publisher_5, session, stream);
    const publisher_6 = initPublisher(stream);
    await publish(publisher_6, session, stream);

    // setTimeout(async () => {
    //   await unpublish(publisher_6, session, stream);
    // }, 10000);
  };

  const initPublisher = (stream) => {
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();

    console.log(videoTracks);

    const publisherOptions = {
      videoSource: videoTracks[0],
      audioSource: audioTracks[0],
      fitMode: 'contain',
      // width: 320,
      // height: 240,
      insertMode: 'append',
    };

    return OT.initPublisher('publisher', publisherOptions, (err) => {
      if (err) {
        videoRef.current.pause();
        handleError(err);
      } else {
        console.log(videoRef.current);
        videoRef.current.play();
      }
    });
  };

  const publish = async (publisher, session, stream) => {
    const publishPromise = new Promise((res, rej) => {
      session.publish(publisher, (err) => {
        if (err) rej(err);
        else res();
      });
    });

    stream.addEventListener('addtrack', async () => {
      await publishPromise;
    });
  };

  const unpublish = async (publisher, session, stream) => {
    const unpublishPromise = new Promise((res, rej) => {
      session.unpublish(publisher, (err) => {
        if (err) rej(err);
        else res();
      });
    });

    stream.addEventListener('stoptrack', async () => {
      await unpublishPromise;
    });
  };

  useEffect(() => {
    if (apiKey && sessionId && token) {
      // API_KEY apiKey = API_KEY;
      // sessionId = SESSION_ID;
      // token = TOKEN;
      videoRef.current.src = video;
      console.log(videoRef.current);
      videoEl = videoRef.current;
      if (!videoEl.captureStream) {
        alert('This browser does not support VideoElement.captureStream(). You must use Google Chrome.');
      } else {
        initializeSession().catch(handleError);
      }
    }
  }, []);

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] place-items-center" id="publisher"></div>
      <video loop ref={videoRef} autoPlay playsInline src={video} id="video"></video>
    </div>
  );
};

export default ExperienceComposer;
