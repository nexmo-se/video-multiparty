import Videocam from '@mui/icons-material/Videocam';
import More from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import useDevices from '../hooks/useDevices';

import ButtonGroup from '@mui/material/ButtonGroup';
import { ArrowDropDown } from '@mui/icons-material';
import { ClickAwayListener } from '@mui/material';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { MenuItem, MenuList } from '@mui/material';
import NetworkDetails from '../NetworkDetails';
import Participants from '../Participants';
import Test from '../Test';

// import MenuItem from '@material-ui/core/MenuItem';
// import MenuList from '@material-ui/core/MenuList';
import React from 'react';

// import { UserContext } from '../../context/UserContext';

export default function MoreButton({ subStats, rtcStats, stats, hasVideo }) {
  const title = hasVideo ? 'Disable Camera' : 'More Settings';
  const { deviceInfo } = useDevices();
  const [devicesAvailable, setDevicesAvailable] = React.useState(null);
  const [options, setOptions] = React.useState(['Network', 'Participants', 'Network-expanded']);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [menuState, setMenuState] = React.useState(null);
  const [participantsMenuOpen, setParticipantsMenuOpen] = React.useState(false);

  //   const { user } = React.useContext(UserContext);

  //   React.useEffect(() => {
  //     setDevicesAvailable(deviceInfo.videoInputDevices);
  //     if (cameraPublishing) {
  //       const currentDeviceId = getVideoSource()?.deviceId;

  //       const IndexOfSelectedElement = devicesAvailable.indexOf(devicesAvailable.find((e) => e.deviceId === currentDeviceId));
  //       setSelectedIndex(IndexOfSelectedElement);
  //     }
  //   }, [cameraPublishing, getVideoSource, deviceInfo, devicesAvailable]);

  //   React.useEffect(() => {
  //     if (devicesAvailable) {
  //       const videoDevicesAvailable = devicesAvailable.map((e) => {
  //         return e.label;
  //       });
  //       setOptions(videoDevicesAvailable);
  //     }
  //     // if (user.videoEffects.backgroundBlur)
  //     //   setOptions(['Not available with Background Blurring']);
  //   }, [devicesAvailable]);

  const handleChangeVideoSource = (event, index) => {
    setSelectedIndex(index);
    if (index === 1) toggler();

    console.log(' index' + index);
    setOpen(false);
    // const videoDeviceId = devicesAvailable.find((device) => device.label === event.target.textContent).deviceId;
    // changeVideoSource(videoDeviceId);
  };
  const toggler = () => {
    console.log('toggling menu participants');
    setParticipantsMenuOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    console.log('closing menu');
    setSelectedIndex(null);
  };

  const handleToggle = (e) => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        className="m-2 bg-rose-50"
        disableElevation
        sx={{ borderRadius: '30px' }}
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <Tooltip title={title} aria-label="add">
          <IconButton
            onClick={handleToggle}
            edge="start"
            aria-label="videoCamera"
            size="small"
            className={`h-[50px] m-[3px] w-[50px] background-white rounded-3xl color-white`}
          >
            {!hasVideo ? <More /> : <VideoCam />}
          </IconButton>
        </Tooltip>
        {/* <IconButton
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          //   onClick={handleToggle}
          className="rounded-3xl h-[50px] w-[50px] bg-rose-50 "
        >
          <ArrowDropDown className="bg-rose-50" color="white" />
        </IconButton> */}
      </ButtonGroup>
      {selectedIndex === 0 && (
        // <ClickAwayListener onClickAway={handleClickAway}>
        <NetworkDetails handleExit={handleClickAway} subStats={subStats} rtcStats={rtcStats} stats={stats}></NetworkDetails>
        // </ClickAwayListener>
      )}
      {selectedIndex === 1 && (
        // <ClickAwayListener onClickAway={handleClickAway}>
        <Participants
          // open={menuState === 'participants'}
          toggler={toggler}
          participantsMenuOpen={participantsMenuOpen}
          // handleExit={handleClickAway}
        ></Participants>
        // </ClickAwayListener>
      )}
      {selectedIndex === 2 && <Test handleExit={handleClickAway} subStats={subStats} rtcStats={rtcStats} stats={stats}></Test>}

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 101 }} // todo temporary fix for a bug in MP 0.1.5
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleChangeVideoSource(event, index)}
                      className="background-black"
                      // disabled={user.videoEffects.backgroundBlur}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
