import {
    getCompareValues,
    calculateBloodTestScore,
    calculateNonBloodTestScore,
    calculateRiskFromScore,
    calculateRisk
} from '../thaiCVRiskCalculator';
import { FormData } from '../../types/thaiCVRiskCalculator';
import { BLOOD_TEST_COEFFICIENTS, NON_BLOOD_TEST_COEFFICIENTS } from '../../constants/thaiCVRiskCalculator';

describe('Calculator Utils', () => {
    describe('getCompareValues', () => {
        it('should return correct values for male over 60', () => {
            const result = getCompareValues(1, 65);
            expect(result).toEqual({
                sbp: 132,
                whr: 0.58125,
                wc: 93
            });
        });

        it('should return correct values for female under 60', () => {
            const result = getCompareValues(0, 55);
            expect(result).toEqual({
                sbp: 115,
                whr: 0.52667,
                wc: 79
            });
        });
    });

    describe('calculateBloodTestScore', () => {
        it('should calculate correct score with blood test data', () => {
            const score = calculateBloodTestScore(
                40, // age
                1,  // male
                120, // systolicBP
                true, // diabetes
                200, // totalCholesterol
                false // not smoking
            );

            const expectedScore =
                (BLOOD_TEST_COEFFICIENTS.AGE * 40) +
                (BLOOD_TEST_COEFFICIENTS.SEX * 1) +
                (BLOOD_TEST_COEFFICIENTS.SBP * 120) +
                (BLOOD_TEST_COEFFICIENTS.DIABETES * 1) +
                (BLOOD_TEST_COEFFICIENTS.CHOLESTEROL * 200);

            expect(score).toBeCloseTo(expectedScore, 5);
        });
    });

    describe('calculateNonBloodTestScore', () => {
        it('should calculate correct score without blood test data', () => {
            const score = calculateNonBloodTestScore(
                40, // age
                1,  // male
                120, // systolicBP
                true, // diabetes
                0.5, // whr
                false // not smoking
            );

            const expectedScore =
                (NON_BLOOD_TEST_COEFFICIENTS.AGE * 40) +
                (NON_BLOOD_TEST_COEFFICIENTS.SEX * 1) +
                (NON_BLOOD_TEST_COEFFICIENTS.SBP * 120) +
                (NON_BLOOD_TEST_COEFFICIENTS.DIABETES * 1) +
                (NON_BLOOD_TEST_COEFFICIENTS.WHR * 0.5);

            expect(score).toBeCloseTo(expectedScore, 5);
        });
    });

    describe('calculateRiskFromScore', () => {
        it('should calculate correct risk percentage', () => {
            const risk = calculateRiskFromScore(8, 7);
            expect(risk).toBeGreaterThan(0);
            expect(risk).toBeLessThan(100);
        });
    });

    describe('calculateRisk', () => {
        const baseFormData: FormData = {
            age: 40,
            gender: 'male',
            isSmoking: false,
            hasDiabetes: false,
            systolicBP: 120,
            useBloodTest: false,
            totalCholesterol: undefined,
            waistCircumference: 80,
            height: 170
        };

        it('should calculate risk with blood test data', () => {
            const bloodTestData: FormData = {
                ...baseFormData,
                useBloodTest: true,
                totalCholesterol: 200
            };

            const result = calculateRisk(bloodTestData);
            expect(result).toHaveProperty('predictedRisk');
            expect(result).toHaveProperty('compareRisk');
            expect(result.predictedRisk).toBeGreaterThan(0);
            expect(result.compareRisk).toBeGreaterThan(0);
        });

        it('should calculate risk without blood test data', () => {
            const nonBloodTestData: FormData = {
                ...baseFormData,
                useBloodTest: false,
                waistCircumference: 80,
                height: 170
            };

            const result = calculateRisk(nonBloodTestData);
            expect(result).toHaveProperty('predictedRisk');
            expect(result).toHaveProperty('compareRisk');
            expect(result.predictedRisk).toBeGreaterThan(0);
            expect(result.compareRisk).toBeGreaterThan(0);
        });

        it('should return zero risk for invalid age', () => {
            const invalidData: FormData = {
                ...baseFormData,
                age: 0
            };

            const result = calculateRisk(invalidData);
            expect(result.predictedRisk).toBe(0);
            expect(result.compareRisk).toBe(0);
        });

        it('should return zero risk for invalid systolicBP', () => {
            const invalidData: FormData = {
                ...baseFormData,
                systolicBP: 60
            };

            const result = calculateRisk(invalidData);
            expect(result.predictedRisk).toBe(0);
            expect(result.compareRisk).toBe(0);
        });
    });
});