import { MONTHS } from './constants';
import { linearTaxThresholds, progressiveTaxThresholds } from './tax-thresholds';

export const enum SettingType {
  CURRENCY,
  PERCENT,
  BOOLEAN,
  OPTIONS
}

export type SettingValue = string | number | boolean | null;

export interface Setting {
  key: string;
  name: string;
  description: string;
  value: SettingValue;
  options?: { name: string; value: string }[];
  type: SettingType;
}

export type Settings = typeof settings;

export const enum ZUSTypes {
  NORMAL = 'N',
  PREFERENTIAL = 'P',
  NONE = 'NO'
}

const employmentEntryValue = null;
const b2bEntryValue = null;

export const settings = {
  progressiveTaxThresholds,
  linearTaxThresholds,
  employmentMonths: MONTHS.map(month => ({
    name: month,
    entry: employmentEntryValue
  })),
  b2bMonths: MONTHS.map(month => ({
    name: month,
    entry: b2bEntryValue
  })),
  employmentEntryValue: {
    key: 'employmentEntryValue',
    name: 'Kwota brutto',
    description: 'Miesięczna kwota brutto na umowie o pracę',
    value: employmentEntryValue,
    type: SettingType.CURRENCY
  },
  b2bEntryValue: {
    key: 'b2bEntryValue',
    name: 'Kwota netto na fakturze',
    description: 'Miesięczna kwota netto na fakturze',
    value: b2bEntryValue,
    type: SettingType.CURRENCY
  },
  minimumWage: {
    key: 'minimumWage',
    name: 'Wynagrodzenie minimalne',
    description: 'Wynagrodzenie minimalne brutto ustalone w tegorocznym budżecie państwa',
    value: 2600,
    type: SettingType.CURRENCY
  },
  averageWage: {
    key: 'averageWage',
    name: 'Wynagrodzenie średnie',
    description: 'Wynagrodzenie średnie brutto ustalone w tegorocznym budżecie państwa',
    value: 5227,
    type: SettingType.CURRENCY
  },
  averageWageInEnterpriseSector: {
    key: 'averageWageInEnterpriseSector',
    name: 'Wynagrodzenie średnie w sektorze przedsiębiorstw',
    description: 'Wynagrodzenie średnie brutto w sektorze przedsiębiorstw w czwartym kwartale roku poprzedniego',
    value: 5368.01,
    type: SettingType.CURRENCY
  },
  ageOver26: {
    key: 'ageOver26',
    name: 'Ukończone 26 lat',
    description: 'Osoby poniżej 26. roku życia nie płacą podatku dochodowego do pewnego limitu (kwota limitu podana w Ustawieniach Zawansowanych)',
    value: true,
    type: SettingType.BOOLEAN
  },
  limitForNoIncomeTaxUnder26: {
    key: 'limitForNoIncomeTaxUnder26',
    name: 'Roczny limit dochodu dla zerowego podatku dla osób poniżej 26 lat',
    description: '',
    value: 85528,
    type: SettingType.CURRENCY
  },
  ppkEnabled: {
    key: 'ppkEnabled',
    name: 'Uczestnictwo w PPK',
    description: 'Uczestnictwo w Pracowniczych Planach Kapitałowych jest nieobowiązkowe',
    value: false,
    type: SettingType.BOOLEAN
  },
  employeePPKPremium: {
    key: 'employeePPKPremium',
    name: 'Wysokość wpłaty pracownika do PPK',
    description: 'Wysokość wpłaty pracownika do Pracowniczych Planów Kapitałowych standardowo wynosi 2% wynagrodzenia, ale można ją zwiększyć do 4%',
    value: 2 / 100,
    type: SettingType.PERCENT
  },
  employerPPKPremium: {
    key: 'employerPPKPremium',
    name: 'Wysokość wpłaty pracodawcy do PPK',
    description:
      'Wysokość wpłaty pracodawcy do Pracowniczych Planów Kapitałowych standardowo wynosi 1,5% wynagrodzenia, ale można ją zwiększyć do 4%',
    value: 1.5 / 100,
    type: SettingType.PERCENT
  },
  employeePensionInsurancePremium: {
    key: 'employeePensionInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie emerytalne',
    description: '',
    value: 9.76 / 100,
    type: SettingType.PERCENT
  },
  employeeDisabilityInsurancePremium: {
    key: 'employeeDisabilityInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie rentowe',
    description: '',
    value: 1.5 / 100,
    type: SettingType.PERCENT
  },
  employeeSicknessInsurancePremium: {
    key: 'employeeSicknessInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie chorobowe',
    description: '',
    value: 2.45 / 100,
    type: SettingType.PERCENT
  },
  employeeHealthInsurancePremium: {
    key: 'employeeHealthInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie zdrowotne',
    description: '',
    value: 9 / 100,
    type: SettingType.PERCENT
  },
  employeeHealthInsurancePremiumDeductible: {
    key: 'employeeHealthInsurancePremiumDeductible',
    name: 'Wysokość składki na ubezpieczenie zdrowotne do odliczenia',
    description: 'Wysokość składki na ubezpieczenie zdrowotne możliwa do odliczenia od podatku dochodowego',
    value: 7.75 / 100,
    type: SettingType.PERCENT
  },
  employerPensionInsurancePremium: {
    key: 'employerPensionInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie emerytalne',
    description: '',
    value: 9.76 / 100,
    type: SettingType.PERCENT
  },
  employerDisabilityInsurancePremium: {
    key: 'employerDisabilityInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie rentowe',
    description: '',
    value: 6.5 / 100,
    type: SettingType.PERCENT
  },
  employerAccidentInsurancePremium: {
    key: 'employerAccidentInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie wypadkowe',
    description: '',
    value: 1.67 / 100,
    type: SettingType.PERCENT
  },
  employerFPPremium: {
    key: 'employerFPPremium',
    name: 'Wysokość składki na Fundusz Pracy',
    description: '',
    value: 2.45 / 100,
    type: SettingType.PERCENT
  },
  employerFGSPPremium: {
    key: 'employerFGSPPremium',
    name: 'Wysokość składki na Fundusz Gwarantowanych Świadczeń Pracowniczych',
    description: '',
    value: 0.1 / 100,
    type: SettingType.PERCENT
  },
  employmentOutsidePlaceOfResidence: {
    key: 'employmentOutsidePlaceOfResidence',
    name: 'Praca poza miejscem zamieszkania',
    description:
      'Osobom pracującym poza miejscem zamieszkania przysługuje większa kwota kosztów uzyskania przychodu (kwoty podane w Ustawieniach Zaawansowanych)',
    value: false,
    type: SettingType.BOOLEAN
  },
  employeeTaxDeductibleExpensesInPlaceOfResidence: {
    key: 'employeeTaxDeductibleExpensesInPlaceOfResidence',
    name: 'Koszty uzyskania przychodu w miejscu zamieszkania',
    description: 'Koszty uzyskania przychodu przysługujące osobom pracującym w miejscu zamieszkania',
    value: 250,
    type: SettingType.CURRENCY
  },
  employeeTaxDeductibleExpensesOutsidePlaceOfResidence: {
    key: 'employeeTaxDeductibleExpensesOutsidePlaceOfResidence',
    name: 'Koszty uzyskania przychodu poza miejscem zamieszkania',
    description: 'Koszty uzyskania przychodu przysługujące osobom pracującym poza miejscem zamieszkania',
    value: 300,
    type: SettingType.CURRENCY
  },
  copyrightTaxDeductibleExpensesEnabled: {
    key: 'copyrightTaxDeductibleExpensesEnabled',
    name: 'Autorskie koszty uzyskania przychodu',
    description:
      'Autorskie koszty uzyskania przychodu wynoszące 50% przychodu stosowane są w przypadku twórców i autorów. Koszty te mogą dotyczyć tylko części wynagrodzenia',
    value: false,
    type: SettingType.BOOLEAN
  },
  copyrightTaxDeductibleExpenses: {
    key: 'copyrightTaxDeductibleExpenses',
    name: 'Część wynagrodzenia podlegająca autorskim kosztom',
    description: '',
    value: 100 / 100,
    type: SettingType.PERCENT
  },
  limitOfCopyrightTaxDeductibleExpenses: {
    key: 'limitOfCopyrightTaxDeductibleExpenses',
    name: 'Roczny limit autorskich kosztów',
    description: '',
    value: 85528,
    type: SettingType.CURRENCY
  },
  b2bPensionInsurancePremium: {
    key: 'b2bPensionInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie emerytalne',
    description: '',
    value: 19.52 / 100,
    type: SettingType.PERCENT
  },
  b2bDisabilityInsurancePremium: {
    key: 'b2bDisabilityInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie rentowe',
    description: '',
    value: 8 / 100,
    type: SettingType.PERCENT
  },
  b2bSicknessInsurancePremium: {
    key: 'b2bSicknessInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie chorobowe',
    description: '',
    value: 2.45 / 100,
    type: SettingType.PERCENT
  },
  b2bHealthInsurancePremium: {
    key: 'b2bHealthInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie zdrowotne',
    description: '',
    value: 9 / 100,
    type: SettingType.PERCENT
  },
  b2bHealthInsurancePremiumDeductible: {
    key: 'b2bHealthInsurancePremiumDeductible',
    name: 'Część składki na ubezpieczenie zdrowotne do odliczenia',
    description: 'Wysokość składki na ubezpieczenie zdrowotne możliwa do odliczenia od podatku dochodowego',
    value: 7.75 / 100,
    type: SettingType.PERCENT
  },
  b2bAccidentInsurancePremium: {
    key: 'b2bAccidentInsurancePremium',
    name: 'Wysokość składki na ubezpieczenie wypadkowe',
    description: '',
    value: 1.67 / 100,
    type: SettingType.PERCENT
  },
  b2bFPPremium: {
    key: 'b2bFPPremium',
    name: 'Wysokość składki na Fundusz Pracy',
    description: '',
    value: 2.45 / 100,
    type: SettingType.PERCENT
  },
  b2bSicknessInsuranceEnabled: {
    key: 'b2bSicknessInsuranceEnabled',
    name: 'Ubezpieczenie chorobowe',
    description: 'Ubezpieczenie chorobowe jest nieobowiązkowe',
    value: false,
    type: SettingType.BOOLEAN
  },
  b2bLinearTaxEnabled: {
    key: 'b2bLinearTaxEnabled',
    name: 'Podatek liniowy',
    description:
      'Użyj podatku liniowego zamiast progresywnego. Aby z niego skorzystać należy złożyć specjalne oświadczenie (więcej szczegółów w Ustawieniach Zaawansowanych)',
    value: false,
    type: SettingType.BOOLEAN
  },
  b2bZUSType: {
    key: 'b2bZUSType',
    name: 'Składka ZUS',
    description:
      'Typy składek ZUS:\n1. Normalna\n2. Preferencyjna - niższe składki ZUS przez pierwsze 2 lata od rozpoczęcia opłacania tych składek\n3. Brak ("ulga na start") - brak składek ZUS przez pierwsze pół roku działalności gospodarczej',
    value: ZUSTypes.NORMAL,
    options: [
      { name: 'Normalna', value: ZUSTypes.NORMAL, description: 'Normalna składka ZUS' },
      { name: 'Preferencyjna', value: ZUSTypes.PREFERENTIAL, description: 'Preferencyjna składka ZUS' },
      { name: 'Brak', value: ZUSTypes.NONE, description: 'Brak składki ZUS' }
    ],
    type: SettingType.OPTIONS
  },
  basisOfSocialInsurancePremiumForNormalZUS: {
    key: 'basisOfSocialInsurancePremiumForNormalZUS',
    name: 'Podstawa wymiaru składek społecznych (normalna składka ZUS)',
    description: 'Liczona względem wynagrodzenia średniego',
    value: 60 / 100,
    type: SettingType.PERCENT
  },
  basisOfSocialInsurancePremiumForPreferentialZUS: {
    key: 'basisOfSocialInsurancePremiumForPreferentialZUS',
    name: 'Podstawa wymiaru składek społecznych (preferencyjna składka ZUS)',
    description: 'Liczona względem wynagrodzenia minimalnego',
    value: 30 / 100,
    type: SettingType.PERCENT
  },
  basisOfHealthInsurancePremium: {
    key: 'basisOfHealthInsurancePremium',
    name: 'Podstawa wymiaru składki zdrowotnej',
    description: 'Liczona względem wynagrodzenia średniego w sektorze przedsiębiorstw',
    value: 75 / 100,
    type: SettingType.PERCENT
  }
};

// values in 2019
// settings.employeeTaxDeductibleExpensesInPlaceOfResidence.value = 111.25;
// settings.employeeTaxDeductibleExpensesOutsidePlaceOfResidence.value = 139.06;
// settings.minimumWage.value = 2250;
// settings.averageWage.value = 4765;
// settings.averageWageInEnterpriseSector.value = 5071.25;
