import * as React from 'react';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';

import { B2B } from './b2b/b2b';
import { Employment } from './employment/employment';
import { Summary } from './summary/summary';

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3)
    }
  }
}));

export function Main() {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Employment></Employment>
        </Grid>
        <Grid item xs={12} md={6}>
          <B2B></B2B>
        </Grid>
        <Grid item md={3} implementation="css" xsDown component={Hidden}></Grid>
        <Grid item xs={12} md={6}>
          <Summary></Summary>
        </Grid>
        <Grid item md={3} implementation="css" xsDown component={Hidden}></Grid>
      </Grid>
    </main>
  );
}
