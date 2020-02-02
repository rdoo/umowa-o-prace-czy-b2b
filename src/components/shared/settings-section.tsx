import * as React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { Setting, SettingValue } from '../../utils/settings';
import { HelpButton } from '../ui/help-button';
import { SettingInput } from '../ui/setting-input';

export interface SettingsSectionProps {
  settings: Setting[];
  onChange(key: string, value: SettingValue): void;
}

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '1rem',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 520,
      marginRight: 'auto',
      marginLeft: 'auto',
      alignItems: 'center'
    }
  },
  cell: {
    padding: theme.spacing(1, 0),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1)
    }
  },
  basis: {
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0)
    }
  },
  label: {
    [theme.breakpoints.up('sm')]: {
      textAlign: 'end'
    }
  },
  help: {
    marginTop: -2,
    padding: 0,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1)
    },
    '& button': {
      float: 'right'
    }
  }
}));

export const SettingsSection: React.FC<SettingsSectionProps> = ({ settings, onChange }) => {
  const classes = useStyles();

  const handleChange = React.useCallback((key: string) => (value: SettingValue) => onChange(key, value), [onChange]);

  return (
    <Grid container className={classes.root}>
      {settings.map(setting => {
        return (
          <React.Fragment key={setting.key}>
            <Grid container item xs={10} sm={10} className={classes.basis}>
              <Grid item xs={12} sm={7} className={classes.cell + ' ' + classes.label}>
                <label htmlFor={setting.key}>{setting.name}:</label>
              </Grid>
              <Grid item xs={12} sm={5} className={classes.cell}>
                <SettingInput
                  id={setting.key}
                  value={setting.value}
                  type={setting.type}
                  options={setting.options}
                  onChange={handleChange(setting.key)}
                ></SettingInput>
              </Grid>
            </Grid>

            <Grid item xs={2} sm={2} className={classes.cell + ' ' + classes.help}>
              {setting.description && <HelpButton description={setting.description}></HelpButton>}
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  );
};
