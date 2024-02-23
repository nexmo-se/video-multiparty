import React, { useEffect, useMemo, useState, useRef } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';
function CustomSubscriber({ elem }) {
  const videoRef = useRef(null);
  let streamRef = null;
  useEffect(() => {
    if (elem) {
      //   videoRef.current = elem;
      console.log(elem);
      console.log(videoRef.current);
      videoRef.current.srcObject = elem.srcObject;
      streamRef = elem.srcObject;

      videoRef.current.onplay = () => {
        console.log('stream changed');
        if (streamRef !== videoRef.current.srcObject) {
          // Update stream with the new value

          streamRef = videoRef.current.srcObject;
          videoRef.current.srcObject = streamRef;
        }
      };
    }
  }, [elem, streamRef]);
  return (
    // <video height={'100%'} width={'100%'} ref={videoRef} autoPlay playsInline muted></video>
    <div className="block overflow-hidden">
      <PushPinIcon></PushPinIcon>

      <video ref={videoRef} autoPlay playsInline muted></video>
    </div>
  );
}

export default CustomSubscriber;
