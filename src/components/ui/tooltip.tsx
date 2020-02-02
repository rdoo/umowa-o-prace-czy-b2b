import * as React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MUITooltip, { TooltipProps } from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: '0.875rem',
    whiteSpace: 'pre-wrap'
  },
  arrow: {
    color: theme.palette.primary.main
  }
}));

const leaveTouchDelay = 60 * 1000; // 1 minute

export const Tooltip: React.FC<TooltipProps> = props => {
  const classes = useStyles();

  return <MUITooltip enterTouchDelay={0} leaveTouchDelay={leaveTouchDelay} arrow classes={classes} {...props}></MUITooltip>;
};
