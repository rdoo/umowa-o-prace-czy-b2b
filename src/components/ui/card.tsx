import * as React from 'react';

import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

interface CardProps {
  title: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3)
    },
    [theme.breakpoints.up('md')]: {
      boxSizing: 'border-box',
      height: '100%'
    }
  },
  title: {
    textAlign: 'center'
  }
}));

export const Card: React.FC<CardProps> = ({ title, children }) => {
  const classes = useStyles();

  return (
    <Paper elevation={2} className={classes.root}>
      <Typography variant="h5" component="h2" gutterBottom className={classes.title}>
        {title}
      </Typography>
      <div>{children}</div>
    </Paper>
  );
};
