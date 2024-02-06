import React from 'react';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import { IconButton } from '@mui/material';

function index({ handleClick }) {
  return (
    <IconButton variant="solid" onClick={handleClick} className="border solid-[2px]">
      <ChatTwoToneIcon variant="solid" fontSize="large"></ChatTwoToneIcon>
    </IconButton>
  );
}

export default index;
