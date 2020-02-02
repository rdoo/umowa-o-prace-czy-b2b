import * as React from 'react';

import Button from '@material-ui/core/Button';

import { Dialog, DialogProps } from './dialog';

type DialogPropsForTrigger = Omit<DialogProps, 'open' | 'onClose' | 'title'> & Partial<Pick<DialogProps, 'title'>>;

interface DialogTriggerProps extends DialogPropsForTrigger {
  label: string;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = props => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = React.useCallback(() => setOpen(true), []);
  const handleClose = React.useCallback(() => setOpen(false), []);

  const title = props.title || props.label;

  return (
    <>
      <Button color="primary" variant="outlined" onClick={handleOpen}>
        {props.label}
      </Button>
      <Dialog open={open} onClose={handleClose} title={title} {...props}></Dialog>
    </>
  );
};
