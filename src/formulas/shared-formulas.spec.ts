import { MONTHS_LENGTH } from '../utils/constants';
import { linearTaxThresholds, progressiveTaxThresholds, TaxThreshold } from '../utils/tax-thresholds';
import {
    calcMonthlyTaxAllowance, calcMonthlyTaxForB2B, calcMonthlyTaxForEmployment, calcProportionalTaxAllowance, calcYearlyTax, calcYearlyTaxAllowance,
    getMainTaxThresholds, getTaxThresholdsWithNoTax
} from './shared-formulas';

describe(__filename.slice(__dirname.length + 1, -8), () => {
  describe('calcYearlyTaxAllowance', () => {
    describe('for progressive tax thresholds', () => {
      const calcProgressiveTaxAllowance = calcYearlyTaxAllowance(progressiveTaxThresholds);

      it('equals first tax allowance for negative income', () => {
        const firstTaxThreshold = progressiveTaxThresholds[0] as TaxThreshold<number>;
        expect(calcProgressiveTaxAllowance(-1)).toBeCloseTo(firstTaxThreshold.free * firstTaxThreshold.rate.rate);
      });

      it('equals first tax allowance for 0 income', () => {
        const firstTaxThreshold = progressiveTaxThresholds[0] as TaxThreshold<number>;
        expect(calcProgressiveTaxAllowance(0)).toBeCloseTo(firstTaxThreshold.free * firstTaxThreshold.rate.rate);
      });

      it('equals 0 for high income', () => {
        expect(calcProgressiveTaxAllowance(Number.MAX_VALUE)).toBeCloseTo(0);
      });

      it('calcs properly basic tax thresholds', () => {
        const basicTaxThreshold = progressiveTaxThresholds[2] as TaxThreshold<number>;
        expect(calcProgressiveTaxAllowance(basicTaxThreshold.to)).toBeCloseTo(basicTaxThreshold.free * basicTaxThreshold.rate.rate);
      });

      it('calcs properly proportional tax thresholds', () => {
        const proportionalTaxThreshold = progressiveTaxThresholds[1];
        const prevTaxThreshold = progressiveTaxThresholds[0] as TaxThreshold<number>;
        const nextTaxThreshold = progressiveTaxThresholds[2] as TaxThreshold<number>;
        const income = proportionalTaxThreshold.to;
        expect(calcProgressiveTaxAllowance(income)).toBeCloseTo(
          calcProportionalTaxAllowance(proportionalTaxThreshold, prevTaxThreshold, nextTaxThreshold, income)
        );
      });
    });

    describe('for linear tax thresholds', () => {
      const calcLinearTaxAllowance = calcYearlyTaxAllowance(linearTaxThresholds);

      it('equals 0 for negative income', () => {
        expect(calcLinearTaxAllowance(-1)).toBeCloseTo(0);
      });

      it('equals 0 for 0 income', () => {
        expect(calcLinearTaxAllowance(0)).toBeCloseTo(0);
      });

      it('equals 0 for high income', () => {
        expect(calcLinearTaxAllowance(Number.MAX_VALUE)).toBeCloseTo(0);
      });
    });

    describe('for tax thresholds with no tax', () => {
      const noTaxLimit = 80000;
      const taxThresholdsWithNoTax = getTaxThresholdsWithNoTax(progressiveTaxThresholds, noTaxLimit);
      const calcNoTaxTaxAllowance = calcYearlyTaxAllowance(taxThresholdsWithNoTax);

      it('equals 0 for negative income', () => {
        expect(calcNoTaxTaxAllowance(-1)).toBeCloseTo(0);
      });

      it('equals 0 for 0 income', () => {
        expect(calcNoTaxTaxAllowance(0)).toBeCloseTo(0);
      });

      it('equals 0 for income equal to no tax limit', () => {
        expect(calcNoTaxTaxAllowance(noTaxLimit)).toBeCloseTo(0);
      });
    });
  });

  describe('calcMonthlyTaxAllowance', () => {
    it('equals 1/12 of yearly tax allowance', () => {
      const firstMainTaxThreshold = getMainTaxThresholds(progressiveTaxThresholds)[0];
      expect(calcMonthlyTaxAllowance(progressiveTaxThresholds, firstMainTaxThreshold.to)).toBeCloseTo(
        calcYearlyTaxAllowance(progressiveTaxThresholds, firstMainTaxThreshold.to) / 12
      );
    });
  });

  describe('calcYearlyTax', () => {
    describe('for progressive tax thresholds', () => {
      const calcProgressiveYearlyTax = calcYearlyTax(progressiveTaxThresholds);

      it('equals 0 for negative income', () => {
        expect(calcProgressiveYearlyTax(-1)).toBeCloseTo(0);
      });

      it('equals 0 for 0 income', () => {
        expect(calcProgressiveYearlyTax(0)).toBeCloseTo(0);
      });

      it('equals 0 for total free tax thresholds', () => {
        const totalFreeTaxThreshold = progressiveTaxThresholds[0];
        expect(calcProgressiveYearlyTax(totalFreeTaxThreshold.to)).toBeCloseTo(0);
      });

      it('calcs properly first tax threshold', () => {
        const mainTaxThresholds = getMainTaxThresholds(progressiveTaxThresholds);
        const firstTaxThreshold = mainTaxThresholds[0] as TaxThreshold<number>;
        expect(calcProgressiveYearlyTax(firstTaxThreshold.to)).toBeCloseTo(
          (firstTaxThreshold.to - firstTaxThreshold.free) * firstTaxThreshold.rate.rate
        );
      });

      it('calcs properly second tax threshold', () => {
        const mainTaxThresholds = getMainTaxThresholds(progressiveTaxThresholds);
        const firstTaxThreshold = mainTaxThresholds[0];
        const secondTaxThreshold = mainTaxThresholds[1];
        const income = firstTaxThreshold.to + 100000;
        expect(calcProgressiveYearlyTax(income)).toBeCloseTo(
          firstTaxThreshold.to * firstTaxThreshold.rate.rate + (income - firstTaxThreshold.to) * secondTaxThreshold.rate.rate
        );
      });
    });

    describe('for linear tax thresholds', () => {
      const calcLinearYearlyTax = calcYearlyTax(linearTaxThresholds);

      it('equals 0 for negative income', () => {
        expect(calcLinearYearlyTax(-1)).toBeCloseTo(0);
      });

      it('equals 0 for 0 income', () => {
        expect(calcLinearYearlyTax(0)).toBeCloseTo(0);
      });

      it('calcs properly for positive income', () => {
        const taxThreshold = linearTaxThresholds[0];
        const income = 100000;
        expect(calcLinearYearlyTax(income)).toBeCloseTo(income * taxThreshold.rate.rate);
      });
    });

    describe('for tax thresholds with no tax', () => {
      const noTaxLimit = 80000;
      const taxThresholdsWithNoTax = getTaxThresholdsWithNoTax(progressiveTaxThresholds, noTaxLimit);
      const calcNoTaxYearlyTax = calcYearlyTax(taxThresholdsWithNoTax);

      it('equals 0 for negative income', () => {
        expect(calcNoTaxYearlyTax(-1)).toBeCloseTo(0);
      });

      it('equals 0 for 0 income', () => {
        expect(calcNoTaxYearlyTax(0)).toBeCloseTo(0);
      });

      it('equals 0 for income equal to no tax limit', () => {
        expect(calcNoTaxYearlyTax(noTaxLimit)).toBeCloseTo(0);
      });

      it('calcs properly first tax threshold', () => {
        const mainTaxThresholds = getMainTaxThresholds(taxThresholdsWithNoTax);
        const firstTaxThreshold = mainTaxThresholds[1] as TaxThreshold<number>;
        expect(calcNoTaxYearlyTax(firstTaxThreshold.to)).toBeCloseTo(
          (firstTaxThreshold.to - noTaxLimit - firstTaxThreshold.free) * firstTaxThreshold.rate.rate
        );
      });

      it('calcs properly second tax threshold', () => {
        const mainTaxThresholds = getMainTaxThresholds(taxThresholdsWithNoTax);
        const firstTaxThreshold = mainTaxThresholds[1];
        const secondTaxThreshold = mainTaxThresholds[2];
        const income = firstTaxThreshold.to + 100000;
        expect(calcNoTaxYearlyTax(income)).toBeCloseTo(
          (firstTaxThreshold.to - noTaxLimit) * firstTaxThreshold.rate.rate + (income - firstTaxThreshold.to) * secondTaxThreshold.rate.rate
        );
      });
    });
  });

  describe('calcMonthlyTaxForEmployment', () => {
    describe('for progressive tax thresholds', () => {
      const calcProgressiveMonthlyTax = calcMonthlyTaxForEmployment(progressiveTaxThresholds);

      it('equals 0 for negative income', () => {
        expect(calcProgressiveMonthlyTax(0, -1)).toBeCloseTo(0);
      });

      it('equals 0 for 0 income', () => {
        expect(calcProgressiveMonthlyTax(0, 0)).toBeCloseTo(0);
      });

      it('calcs properly first tax threshold', () => {
        const mainTaxThresholds = getMainTaxThresholds(progressiveTaxThresholds);
        const firstTaxThreshold = mainTaxThresholds[0] as TaxThreshold<number>;
        const monthlyIncome = 10000;
        expect(calcProgressiveMonthlyTax(firstTaxThreshold.to, monthlyIncome)).toBeCloseTo(
          (monthlyIncome - firstTaxThreshold.free / MONTHS_LENGTH) * firstTaxThreshold.rate.rate
        );
      });

      it('calcs tax for first tax threshold even if total income just exceeded first tax threshold in current month', () => {
        const mainTaxThresholds = getMainTaxThresholds(progressiveTaxThresholds);
        const firstTaxThreshold = mainTaxThresholds[0] as TaxThreshold<number>;
        const monthlyIncome = 10000;
        expect(calcProgressiveMonthlyTax(firstTaxThreshold.to + 1, monthlyIncome)).toBeCloseTo(
          (monthlyIncome - firstTaxThreshold.free / MONTHS_LENGTH) * firstTaxThreshold.rate.rate
        );
      });

      it('calcs properly second tax threshold', () => {
        const mainTaxThresholds = getMainTaxThresholds(progressiveTaxThresholds);
        const secondTaxThreshold = mainTaxThresholds[1];
        const monthlyIncome = 10000;
        expect(calcProgressiveMonthlyTax(secondTaxThreshold.to, monthlyIncome)).toBeCloseTo(monthlyIncome * secondTaxThreshold.rate.rate);
      });
    });

    describe('for tax thresholds with no tax', () => {
      const noTaxLimit = 80000;
      const taxThresholdsWithNoTax = getTaxThresholdsWithNoTax(progressiveTaxThresholds, noTaxLimit);
      const calcNoTaxMonthlyTax = calcMonthlyTaxForEmployment(taxThresholdsWithNoTax);

      it('equals 0 for negative income', () => {
        expect(calcNoTaxMonthlyTax(0, -1)).toBeCloseTo(0);
      });

      it('equals 0 for 0 income', () => {
        expect(calcNoTaxMonthlyTax(0, 0)).toBeCloseTo(0);
      });

      it('equals 0 for income equal to no tax limit', () => {
        expect(calcNoTaxMonthlyTax(0, noTaxLimit)).toBeCloseTo(0);
      });

      it('equals 0 even if total income just exceeded no tax limit in current month', () => {
        expect(calcNoTaxMonthlyTax(noTaxLimit + 1, Number.MAX_VALUE)).toBeCloseTo(0);
      });

      it('calcs properly first tax threshold', () => {
        const mainTaxThresholds = getMainTaxThresholds(taxThresholdsWithNoTax);
        const firstTaxThreshold = mainTaxThresholds[1] as TaxThreshold<number>;
        const monthlyIncome = 10000;
        expect(calcNoTaxMonthlyTax(firstTaxThreshold.to, monthlyIncome)).toBeCloseTo(
          (monthlyIncome - firstTaxThreshold.free / MONTHS_LENGTH) * firstTaxThreshold.rate.rate
        );
      });

      it('calcs tax for first tax threshold even if total income just exceeded first tax threshold in current month', () => {
        const mainTaxThresholds = getMainTaxThresholds(progressiveTaxThresholds);
        const firstTaxThreshold = mainTaxThresholds[1] as TaxThreshold<number>;
        const monthlyIncome = 10000;
        expect(calcNoTaxMonthlyTax(firstTaxThreshold.to + 1, monthlyIncome)).toBeCloseTo(
          (monthlyIncome - firstTaxThreshold.free / MONTHS_LENGTH) * firstTaxThreshold.rate.rate
        );
      });

      it('calcs properly second tax threshold', () => {
        const mainTaxThresholds = getMainTaxThresholds(taxThresholdsWithNoTax);
        const secondTaxThreshold = mainTaxThresholds[2];
        const monthlyIncome = 10000;
        expect(calcNoTaxMonthlyTax(secondTaxThreshold.to, monthlyIncome)).toBeCloseTo(monthlyIncome * secondTaxThreshold.rate.rate);
      });
    });
  });

  describe('calcMonthlyTaxForB2B', () => {
    describe('for progressive tax thresholds', () => {
      const calcProgressiveMonthlyTax = calcMonthlyTaxForB2B(progressiveTaxThresholds);

      it('equals 0 for negative income', () => {
        expect(calcProgressiveMonthlyTax(0, -1)).toBeCloseTo(0);
      });

      it('equals 0 for 0 income', () => {
        expect(calcProgressiveMonthlyTax(0, 0)).toBeCloseTo(0);
      });

      it('calcs properly first tax threshold', () => {
        const mainTaxThresholds = getMainTaxThresholds(progressiveTaxThresholds);
        const firstTaxThreshold = mainTaxThresholds[0] as TaxThreshold<number>;
        const monthlyIncome = 10000;
        expect(calcProgressiveMonthlyTax(firstTaxThreshold.to, monthlyIncome)).toBeCloseTo(
          (monthlyIncome - firstTaxThreshold.free / MONTHS_LENGTH) * firstTaxThreshold.rate.rate
        );
      });

      it('calcs properly when first tax threshold got excceeded in current month', () => {
        const mainTaxThresholds = getMainTaxThresholds(progressiveTaxThresholds);
        const firstTaxThreshold = mainTaxThresholds[0] as TaxThreshold<number>;
        const secondTaxThreshold = mainTaxThresholds[1];
        const monthlyIncome = 10000;
        const firstTaxThresholdExceededBy = 5000;
        expect(calcProgressiveMonthlyTax(firstTaxThreshold.to + firstTaxThresholdExceededBy, monthlyIncome)).toBeCloseTo(
          (monthlyIncome - firstTaxThresholdExceededBy - firstTaxThreshold.free / MONTHS_LENGTH) * firstTaxThreshold.rate.rate +
            firstTaxThresholdExceededBy * secondTaxThreshold.rate.rate
        );
      });

      it('calcs properly second tax threshold', () => {
        const mainTaxThresholds = getMainTaxThresholds(progressiveTaxThresholds);
        const secondTaxThreshold = mainTaxThresholds[1];
        const monthlyIncome = 10000;
        expect(calcProgressiveMonthlyTax(secondTaxThreshold.to, monthlyIncome)).toBeCloseTo(monthlyIncome * secondTaxThreshold.rate.rate);
      });
    });

    describe('for linear tax thresholds', () => {
      const calcLinearMonthlyTax = calcMonthlyTaxForB2B(linearTaxThresholds);

      it('equals 0 for negative income', () => {
        expect(calcLinearMonthlyTax(0, -1)).toBeCloseTo(0);
      });

      it('equals 0 for 0 income', () => {
        expect(calcLinearMonthlyTax(0, 0)).toBeCloseTo(0);
      });

      it('calcs properly for positive income', () => {
        const taxThreshold = linearTaxThresholds[0];
        const income = 100000;
        expect(calcLinearMonthlyTax(income, income)).toBeCloseTo(income * taxThreshold.rate.rate);
      });
    });
  });
});
