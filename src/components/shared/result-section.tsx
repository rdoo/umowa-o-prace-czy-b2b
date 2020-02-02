import * as React from 'react';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { formatNumberToCurrency } from '../../utils/helpers';
import { MonthlyResult } from '../../utils/models';
import { HelpButton } from '../ui/help-button';

const resultDescriptions = {
  net: 'Kwota netto - kwota, którą dostajemy "na rękę" po opłaceniu wszystkich składek i podatku dochodowego',
  tax: 'Podatek dochodowy (PIT) - podatek opłacany na rzecz państwa zależny od osiągniętego dochodu',
  ppk:
    'Składka na Pracownicze Plany Kapitałowe - dobrowolna składka na umowie o pracę wpłacana na indywidualne konto w systemie PPK.\nCelem tego systemu jest gromadzenie oszczędności z przeznaczeniem głównie na emeryturę. W przeciwieństwie do pozostałych składek - wszystkie środki zgromadzone w PPK są prywatną własnością uczestnika i mogą być w dowolnym momencie przez niego wypłacone',
  pensionInsurance:
    'Składka emerytalna - obowiązkowa składka opłacana na rzecz ZUS.\nDaje prawo do pobierania emerytury po ukończeniu wieku emerytalnego i zakończeniu zatrudnienia. Wysokość emerytury jest zależna od sumy opłaconych składek emerytalnych.\nWysokość tej składki jest ograniczona tzw. "limitem 30-krotności"',
  disabilityInsurance:
    'Składka rentowa - obowiązkowa składka opłacana na rzecz ZUS.\nDaje prawo do uzyskania renty gdy lekarz stwierdzi, że jesteśmy niezdolni do pracy. Jej wysokość zależy od liczby lat płaconych składek i wysokości pensji z ostatnich kilku lat przed otrzymaniem świadczenia rentowego.\nWysokość tej składki jest ograniczona tzw. "limitem 30-krotności"',
  sicknessInsurance:
    'Składka chorobowa - opłacana na rzecz ZUS. Na umowie o pracę jest obowiązkowa, a na B2B - dobrowolna. Daje prawo do otrzymania zasiłku chorobowego, opiekuńczego, macierzyńskiego i rehabilitacyjnego',
  accidentInsurance:
    'Składka wypadkowa - obowiązkowa składka opłacana na rzecz ZUS. Jej opłacanie gwarantuje świadczenia z ZUS w sytuacji wystąpienia wypadku przy pracy lub zachorowania na chorobę zawodową',
  healthInsurance:
    'Składka zdrowotna - obowiązkowa składka opłacana na rzecz ZUS, a następnie kierowana do Narodowego Funduszu Zdrowia. Daje możliwość skorzystania z opieki zdrowotnej w ramach NFZ. Część tej składki obniża wysokość płaconego podatku dochodowego.',
  fp:
    'Składka na Fundusz Pracy - składka opłacana na rzecz państwowego Funduszu Pracy, którego zadaniem jest aktywizacja osób bezrobotnych w postaci np. zasiłków i szkoleń dla bezrobotnych. Z tej składki zwolnione są osoby zarabiające poniżej wynagrodzenia minimalnego',
  fgsp:
    'Składka na Fundusz Gwarantowanych Świadczeń Pracowniczych - składka na rzecz państwowego funduszu, którego głównym celem jest wypłata świadczeń pracownikom w sytuacji niewypłacalności ich pracodawcy. Dotyczy tylko umowy o pracę',
  totalCost: 'Całkowity koszt - całkowita kwota jaka została przeznaczona na nasze zatrudnienie'
};

export interface ResultSectionProps {
  result: MonthlyResult;
}

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '1rem',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 520,
      marginRight: 'auto',
      marginLeft: 'auto'
    }
  },
  cell: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 1)
    }
  },
  basis: {
    alignItems: 'center',
    padding: theme.spacing(1, 0),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0)
    }
  },
  label: {
    paddingBottom: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      paddingBottom: 0,
      textAlign: 'end'
    }
  },
  help: {
    marginTop: -2,
    '& button': {
      float: 'right'
    }
  }
}));

export const ResultSection: React.FC<ResultSectionProps> = ({ result }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <ResultRow label="Kwota netto" value={result.net} description={resultDescriptions.net} className="text-bold"></ResultRow>
      <ResultRow label="Podatek" value={result.tax} description={resultDescriptions.tax}></ResultRow>
      <ResultRow label="Składka emerytalna" value={result.pensionInsurance} description={resultDescriptions.pensionInsurance}></ResultRow>
      <ResultRow label="Składka rentowa" value={result.disabilityInsurance} description={resultDescriptions.disabilityInsurance}></ResultRow>
      <ResultRow label="Składka chorobowa" value={result.sicknessInsurance} description={resultDescriptions.sicknessInsurance}></ResultRow>
      <ResultRow label="Składka wypadkowa" value={result.accidentInsurance} description={resultDescriptions.accidentInsurance}></ResultRow>
      <ResultRow label="Składka zdrowotna" value={result.healthInsurance} description={resultDescriptions.healthInsurance}></ResultRow>
      <ResultRow label="Składka na Fundusz Pracy" value={result.fp} description={resultDescriptions.fp}></ResultRow>
      <ResultRow label="Składka na FGŚP" value={result.fgsp} description={resultDescriptions.fgsp}></ResultRow>
      <ResultRow label="Składka na PPK" value={result.ppk} description={resultDescriptions.ppk}></ResultRow>
      <Grid item xs={12}>
        <Divider className="narrow-divider" />
      </Grid>
      <ResultRow label="Całkowity koszt" value={result.totalCost} description={resultDescriptions.totalCost} className="text-large"></ResultRow>
    </Grid>
  );
};

interface ResultRowProps {
  label: string;
  value: number;
  description?: string;
  className?: string;
}

export const ResultRow: React.FC<ResultRowProps> = ({ label, value, description, className = '' }) => {
  const classes = useStyles();

  return (
    <>
      <Grid container item xs={10} sm={10} className={classes.basis}>
        <Grid item xs={12} sm={7} className={classes.cell + ' ' + classes.label + ' ' + className}>
          {label}:
        </Grid>
        <Grid item xs={12} sm={5} className={classes.cell + ' ' + className}>
          {formatNumberToCurrency(value)}
        </Grid>
      </Grid>

      <Grid item xs={2} sm={2} className={classes.cell + ' ' + classes.help + ' ' + className}>
        {description && <HelpButton description={description}></HelpButton>}
      </Grid>
    </>
  );
};
