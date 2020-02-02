import * as React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
    textAlign: 'center',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2, 3)
    }
  }
}));

export function Header() {
  const classes = useStyles();

  return (
    <header className={classes.root}>
      <Typography variant="h4" component="h1" gutterBottom>
        Umowa o pracę czy B2B
      </Typography>
      <Typography variant="subtitle1" component="p">
        Strona pozwala porównać otrzymaną kwotę netto i zapłacone składki na umowie o pracę i B2B
      </Typography>
    </header>
  );
}
