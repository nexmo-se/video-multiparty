// @flow
import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import usePublisher from './publisher';

function useRtcStats({ publisher }) {
  //   const OTStats = useRef(null);

  const [hasVPN, setHasVPN] = useState(null);
  const [connectionType, setConnectionType] = useState(null);
  const [protocol, setProtocol] = useState(null);
  const [srtpCipher, setSrtpCipher] = useState(null);
  const [ip, setIp] = useState(null);

  const getStats = useCallback(async () => {
    if (publisher) {
      try {
        const stats = await publisher.getRtcStatsReport();
        setSimulcastLayers([]);

        setRtt([]);
        stats[0].rtcStatsReport.forEach((e) => {
          if (e.type === 'local-candidate') {
            if (e.networkType === 'vpn') setHasVPN(true);
            setConnectionType(e.networkType);
            if (e.candidateType === 'relay') {
              setProtocol(`TURN ${e.relayProtocol}`);
              setIp({ ip: e.ip, type: 'relay' });
            } else {
              setProtocol(e.protocol);
            }
          }

          if (e.type === 'transport') {
            setSrtpCipher(e.srtpCipher);
          }
          //   if (e.type === 'remote-inbound-rtp' && e.kind === 'video') {
          //     setJitterVideo(e.jitter);
          //     // const rtt = !isNaN(e.roundTripTime) ? e.roundTripTime : 0;
          //     const rttObject = {
          //       ssrc: e.ssrc,
          //       rtt: e.roundTripTime,
          //       jitter: e.jitter,
          //       packetLostFraction: e.fractionLost * 100,
          //       packetsLostDiff: e.packetsLost - prevPacketsLost.current[e.ssrc],
          //     };
          //     setRtt((rtt) => [...rtt, rttObject]);
          //     prevPacketsLost.current[e.ssrc] = e.packetsLost;
          //   }
          //   if (e.type === 'inbound-rtp' && e.kind === 'video') {
          //     setJitterVideo(e.jitter);
          //   }
          //   if (e.type === 'remote-inbound-rtp' && e.kind === 'audio') {
          //     setJitterAudio(e.jitter);
          //     setAudioPacketsLost(e.fractionLost);
          //   }

          //   if (e.type === 'outbound-rtp' && e.kind === 'video' && e.frameHeight && e.frameWidth && e.bytesSent) {
          //     if (prevTimeStamp.current[e.ssrc] && prevBytesSent.current[e.ssrc]) {
          //       const timedif = e.timestamp - prevTimeStamp.current[e.ssrc];
          //       const bytesDif = e.bytesSent - prevBytesSent.current[e.ssrc];
          //       const bitSec = (8 * bytesDif) / timedif;

          //       const newLayers = {
          //         width: e.frameWidth,
          //         height: e.frameHeight,
          //         framesPerSecond: e.framesPerSecond,
          //         qualityLimitationReason: e.qualityLimitationReason,
          //         id: e.ssrc,
          //         bytes: bitSec,
          //         packetsDiff: e.packetsSent - prevPacketsSent.current[e.ssrc],
          //         // rtt: result?.rtt ? result.rtt : 0,
          //       };

          //       // if (e.frameHeight && e.frameWidth) {
          //       setSimulcastLayers((simulcastLayers) => [...simulcastLayers, newLayers]);
          //     }
          //     prevTimeStamp.current[e.ssrc] = e.timestamp;
          //     prevBytesSent.current[e.ssrc] = e.bytesSent;
          //     prevPacketsSent.current[e.ssrc] = e.packetsSent;
          //   }

          // prevTimeStamp[e.ssrc] = e.timestamp;
          // }
        });

        /* setIsScreenSharing(true); */
      } catch (e) {
        console.log('[useRtcStats] -  error:', e);
      }
    }
  }, [publisher]);

  useEffect(() => {
    if (publisher) {
      setInterval(() => {
        getStats();
      }, 3000);
    } else {
      console.log('no publisher');
    }
  }, [publisher]);

  return {
    protocol,
    ip,
  };
}
export default useRtcStats;
