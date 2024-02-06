import React from 'react';
import { IconButton } from '@mui/material';
import ClosedCaptionIcon from '@mui/icons-material/ClosedCaption';
function index({ handleClick }) {
  return (
    <IconButton className="border solid-[2px]" onClick={handleClick}>
      <ClosedCaptionIcon fontSize="large"></ClosedCaptionIcon>
    </IconButton>
  );
}

export default index;
