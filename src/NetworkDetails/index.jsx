import React from 'react';
import Card from '@mui/joy/Card';

import { LineChart } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsReferenceLine } from '@mui/x-charts';
import { useState } from 'react';
import { ClickAwayListener, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import useRtcStats from '../hooks/rtcStats';
import usePublisher from '../hooks/publisher';
import Tooltip from '@mui/material/Tooltip';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VpnLockIcon from '@mui/icons-material/VpnLock';

import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import SignalWifi1BarIcon from '@mui/icons-material/SignalWifi1Bar';
function NetworkDetails({ subStats, stats, handleExit, rtcStats }) {
  const [bitRate, setBitRate] = React.useState([]);
  const [resolution, setResolution] = React.useState(null);
  const [fps, setFps] = React.useState(null);
  const [packetLoss, setPacketLoss] = React.useState(null);
  const [protocol, setProtocol] = useState(null);
  const [layers, setLayers] = useState(null);

  React.useEffect(() => {
    if (stats && stats.bandwidth && stats.bandwidth > 0) {
      console.log(stats);
      const bitRate = stats.bandwidth;
      setBitRate((prevbitrate) => [...prevbitrate, bitRate]);
      setResolution(`${stats.width}X${stats.height}`);
      setFps(stats.frameRate);
      setPacketLoss(stats.packetLoss);
      setLayers(stats.simulcastLayers);
    }
  }, [stats]);

  return (
    <ClickAwayListener onClickAway={handleExit}>
      <Card
        sx={{
          alignItems: 'start',
          backgroundColor: '#e6e0e0',
          zIndex: '10',
          position: 'absolute',
          bottom: '10vh',
          width: 620,
          height: 700,
        }}
      >
        {bitRate && (
          <>
            {/* <IconButton sx={{ width: '20px' }} onClick={handleExit}>
              <CloseIcon></CloseIcon>
            </IconButton> */}

            {/* {fps && (
              <Tooltip title="This is combined framerate of all the layers that you are sending">
                <AspectRatioIcon></AspectRatioIcon>
                <span> {`Framerate: ${fps}`}</span>
              </Tooltip>
            )}
            {resolution && (
              <div>
                <Tooltip title="This is resolution that you are sending">
                  <AspectRatioIcon></AspectRatioIcon>
                  <span> {`Resolution: ${resolution}`}</span>
                </Tooltip>
              </div>
            )} */}
            {resolution && (
              <div>
                <Tooltip title="This is ratio of packet loss">
                  <SignalWifi1BarIcon></SignalWifi1BarIcon>
                  <span> {`Packet loss: ${packetLoss}`}</span>
                </Tooltip>
              </div>
            )}
            {resolution && (
              <div>
                <Tooltip title="This is the ICE candidate that succeeded">
                  <span> {`Candidate type: ${stats.candidateType}`}</span>
                </Tooltip>
              </div>
            )}
            {resolution && (
              <div>
                <Tooltip title="This is VPN status">
                  <VpnLockIcon></VpnLockIcon>
                  <span> {`VPN : ${stats.hasVpn}`}</span>
                </Tooltip>
              </div>
            )}
            {resolution && (
              <div>
                <Tooltip title="This is ratio of packet loss">
                  <SignalWifi1BarIcon></SignalWifi1BarIcon>
                  <span> {`Network type: ${stats.networkType}`}</span>
                </Tooltip>
              </div>
            )}

            {resolution && (
              <div>
                <Tooltip title="This is protocol you are using to send Media.">
                  <CloudDownloadIcon></CloudDownloadIcon>
                  <span> {`Media Protocol: ${stats.protocol}`}</span>
                </Tooltip>
              </div>
            )}
            <h1 className="self-center">Layers</h1>
            {layers &&
              layers.map((layer) => (
                <div>
                  <Tooltip title="These are the simulcast layers">
                    <AspectRatioIcon></AspectRatioIcon>
                    <span> {`Resolution: ${layer.width}X${layer.height};`}</span>
                    <span> {`Frames: ${layer.framesPerSecond}`}</span>
                    {layer.qualityLimitationReason !== 'none' && <span> {`QualityLimitation: ${layer.qualityLimitationReason}`}</span>}
                  </Tooltip>
                </div>
              ))}

            {subStats && (
              <div>
                <Tooltip title="This is the bandwidth consumed when subscribing to other people's video">
                  <CloudDownloadIcon></CloudDownloadIcon>
                  <span> {`Download bandwidth: ${subStats.vbw} Kbps`}</span>
                </Tooltip>
              </div>
            )}

            {/* <LineChart
              margin={{ bottom: 20, right: 10 }}
              yAxis={[{ data: [0, 100, 200, 300, 500, 800, 10000], label: 'Bitrate (kbps)' }]}
              series={[
                {
                  data: bitRate,
                },
              ]}
              width={500}
              height={300}
            /> */}
            <div className="self-center m-top-2">
              <h1>Your upload Banwidth</h1>
            </div>
            <ChartContainer
              width={500}
              height={450}
              series={[{ data: [100, 250, ...bitRate], label: 'Upload Bitrate', type: 'line' }]}
              yAxis={[{ data: [0, 100, 200, 300, 500, 800, 10000], label: 'Bitrate (kbps)' }]}
              xAxis={[{ scaleType: 'point', data: Array.from({ length: bitRate.length + 2 }, (_, index) => index) }]}
            >
              <LinePlot />
              <MarkPlot />

              <ChartsReferenceLine y={200} label="Min BW at 640X480" lineStyle={{ stroke: 'red' }} />
              <ChartsReferenceLine y={600} label="Min BW at 1080X720" lineStyle={{ stroke: 'red' }} />
              {/* <ChartsXAxis /> */}
              <ChartsYAxis />
            </ChartContainer>
            {/* <LinePlot />
            <MarkPlot />
            <ChartsReferenceLine y={300} label="Min" lineStyle={{ stroke: 'red' }} /> */}
          </>
        )}
      </Card>
    </ClickAwayListener>
  );
}

export default NetworkDetails;
