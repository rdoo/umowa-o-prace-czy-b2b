import * as React from 'react';

import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/HelpOutline';

import { Tooltip } from './tooltip';

interface HelpButtonProps {
  description: string;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ description }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = React.useCallback(() => setOpen(true), []);
  const handleClose = React.useCallback(() => setOpen(false), []);

  return (
    <Tooltip open={open} onOpen={handleOpen} onClose={handleClose} title={description}>
      <IconButton color="primary" aria-label="Pokaż pomoc" onClick={handleOpen}>
        <HelpIcon />
      </IconButton>
    </Tooltip>
  );
};
