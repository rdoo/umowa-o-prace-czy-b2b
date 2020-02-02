import * as React from 'react';

import MUIDialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

export interface DialogProps {
  title: string;
  fullWidth?: boolean;
  open: boolean;
  onClose(): void;
}

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      margin: 0,
      borderRadius: 0
    }
  },
  title: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2, 3)
    },
    '& .MuiTypography-root': {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      fontSize: '1.5rem'
    }
  },
  content: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2, 3)
    }
  }
}));

export const Dialog: React.FC<DialogProps> = ({ title, fullWidth = false, open, onClose, children }) => {
  const classes = useStyles();

  return (
    <MUIDialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth={fullWidth}
      classes={{ paper: 'dialog ' + classes.root }}
      aria-labelledby="dialog-title"
    >
      <DialogTitle id="dialog-title" className={classes.title}>
        <div>{title}</div>
        <IconButton aria-label="Zamknij okno dialogowe" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true} className={classes.content}>
        {children}
      </DialogContent>
    </MUIDialog>
  );
};
