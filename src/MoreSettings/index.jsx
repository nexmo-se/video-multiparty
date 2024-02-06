import * as React from 'react';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import MoreVert from '@mui/icons-material/MoreVert';
import NetworkDetails from '../NetworkDetails';
import Participants from '../Participants';
import { ClickAwayListener } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

function MoreSettings({ subStats, rtcStats, stats }) {
  const [menuState, setMenuState] = React.useState(null);
  const [participantsMenuOpen, setParticipantsMenuOpen] = React.useState(false);

  const toggler = () => {
    console.log('toggling menu participants');
    setParticipantsMenuOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    console.log('closing menu');
    setMenuState(null);
  };

  const handleMenuItem = (submenu) => {
    setMenuState(submenu);
  };
  return (
    <>
      <Dropdown className="contents">
        <MenuButton className="contents" slots={{ root: IconButton }} slotProps={{ root: { variant: '', color: 'neutral' } }}>
          <MoreVert className="contents" fontSize="large" />
        </MenuButton>
        <Menu>
          <MenuItem
            onClick={() => {
              handleMenuItem('network');
            }}
          >
            Network
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuItem('participants');
              toggler();
            }}
          >
            Participants
          </MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu>
      </Dropdown>
      {menuState === 'network' && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <NetworkDetails handleExit={handleClickAway} subStats={subStats} rtcStats={rtcStats} stats={stats}></NetworkDetails>
        </ClickAwayListener>
      )}
      {menuState === 'participants' && (
        // <ClickAwayListener onClickAway={handleClickAway}>
        <Participants
          // open={menuState === 'participants'}
          toggler={toggler}
          participantsMenuOpen={participantsMenuOpen}
          // handleExit={handleClickAway}
        ></Participants>
        // </ClickAwayListener>
      )}
    </>
  );
}
export default MoreSettings;
