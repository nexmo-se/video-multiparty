import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import NetworkDetails from '../../NetworkDetails';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import Tooltip from '@mui/material/Tooltip';

import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import SignalWifi1BarIcon from '@mui/icons-material/SignalWifi1Bar';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Card sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Card>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ zIndex: 5, width: '50%', height: '50%' }}>
      <Card sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Video" {...a11yProps(0)} />
          <Tab label="Audio" {...a11yProps(1)} />
        </Tabs>
      </Card>

      <CustomTabPanel value={value} index={0}>
        <div>
          <Tooltip title="This is ratio of packet loss">
            <SignalWifi1BarIcon></SignalWifi1BarIcon>
            <span> {`Packet loss: 1233`}</span>
          </Tooltip>
        </div>
        <div>
          <Tooltip title="This is the ICE candidate that succeeded">
            <span> {`Candidate type: srflx`}</span>
          </Tooltip>
        </div>
        <div>
          <Tooltip title="This is VPN status">
            <VpnLockIcon></VpnLockIcon>
            <span> {`VPN : Nope`}</span>
          </Tooltip>
        </div>
        <div>
          <Tooltip title="This is ratio of packet loss">
            <SignalWifi1BarIcon></SignalWifi1BarIcon>
            <span> {`Packet loss: 1233`}</span>
          </Tooltip>
        </div>
        <div>
          <Tooltip title="This is ratio of packet loss">
            <span> {`BW: 1233`}</span>
          </Tooltip>
        </div>
        <div>
          <Tooltip title="This is protocol you are using to send Media.">
            <CloudDownloadIcon></CloudDownloadIcon>
            <span> {`Media Protocol: UDP`}</span>
          </Tooltip>
        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Card>
  );
}
