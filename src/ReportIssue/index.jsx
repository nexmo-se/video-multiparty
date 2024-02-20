import React from 'react';
import Card from '@mui/joy/Card';

import { LineChart } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsReferenceLine } from '@mui/x-charts';
import { useState } from 'react';
import { ClickAwayListener, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

import Tooltip from '@mui/material/Tooltip';
import { UserContext } from '../Context/user';

import Rating from '@mui/material/Rating';

import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

function NetworkDetails({ subStats, stats, handleExit, rtcStats }) {
  const [bitRate, setBitRate] = React.useState([]);
  const [resolution, setResolution] = React.useState(null);
  const [fps, setFps] = React.useState(null);
  const [packetLoss, setPacketLoss] = React.useState(null);
  const [protocol, setProtocol] = useState(null);
  const [layers, setLayers] = useState(null);
  const [value, setValue] = useState(4);
  const { user } = React.useContext(UserContext);
  // React.useEffect(() => {
  //   if (stats && stats.bandwidth && stats.bandwidth > 0) {
  //     console.log(stats);
  //     const bitRate = stats.bandwidth;
  //     setBitRate((prevbitrate) => [...prevbitrate, bitRate]);
  //     setResolution(`${stats.width}X${stats.height}`);
  //     setFps(stats.frameRate);
  //     setPacketLoss(stats.packetLoss);
  //     setLayers(stats.simulcastLayers);
  //   }
  // }, [stats]);

  return (
    <ClickAwayListener onClickAway={handleExit}>
      <Card
        sx={{
          alignItems: 'start',
          backgroundColor: '#e6e0e0',
          zIndex: '10',
          position: 'absolute',
          bottom: '10vh',
          width: 320,
          height: 500,
        }}
      >
        <h2 className="mx-auto">Report an issue</h2>
        {user.issues.reconnections ? <div>Reconnections: {user.issues.reconnections}</div> : <span>You had no reconnections</span>}
        {user.issues.audioFallbacks ? (
          <div>Audio fallbacks: {user.issues.audioFallbacks}</div>
        ) : (
          <span>You did not go into audio fallback mode</span>
        )}
        <div className="flex">
          <span>Problem with Audio</span>
          <Switch label="Problem with video" />
        </div>
        <div className="flex">
          <span>Problem with Video</span>
          <Switch label="Problem with video" />
        </div>
        <TextField id="outlined-multiline-static" label="Add any details" multiline rows={4} defaultValue="..." />
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />
        <IconButton
          onClick={handleExit}
          sx={{
            margin: 'auto',
          }}
        >
          <Button>Send</Button>
        </IconButton>

        {/* {bitRate && (
          <>
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
             
              <ChartsYAxis />
            </ChartContainer>
          </>
        )} */}
      </Card>
    </ClickAwayListener>
  );
}

export default NetworkDetails;
