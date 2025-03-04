import { CompareValues, FormData, RiskResult } from '../types/thaiCVRiskCalculator';
import {
    SURVIVAL_ROOT,
    BLOOD_TEST_COEFFICIENTS,
    NON_BLOOD_TEST_COEFFICIENTS,
    DEFAULT_VALUES
} from '../constants/thaiCVRiskCalculator';

export const getCompareValues = (sex: number, age: number): CompareValues => {
    let sbp = DEFAULT_VALUES.COMPARE_SBP.DEFAULT;
    let whr = DEFAULT_VALUES.COMPARE_WHR.FEMALE;
    let wc = DEFAULT_VALUES.COMPARE_WC.FEMALE;

    if (sex === 1 && age > 60) sbp = DEFAULT_VALUES.COMPARE_SBP.MALE_OVER_60;
    if (sex === 0 && age <= 60) sbp = DEFAULT_VALUES.COMPARE_SBP.FEMALE_UNDER_60;
    if (sex === 0 && age > 60) sbp = DEFAULT_VALUES.COMPARE_SBP.FEMALE_OVER_60;
    if (sex === 1) {
        whr = DEFAULT_VALUES.COMPARE_WHR.MALE;
        wc = DEFAULT_VALUES.COMPARE_WC.MALE;
    }

    return { sbp, whr, wc };
};

export const calculateBloodTestScore = (
    age: number,
    sex: number,
    systolicBP: number,
    hasDiabetes: boolean,
    totalCholesterol: number,
    isSmoking: boolean
): number => {
    return (BLOOD_TEST_COEFFICIENTS.AGE * age) +
        (BLOOD_TEST_COEFFICIENTS.SEX * sex) +
        (BLOOD_TEST_COEFFICIENTS.SBP * systolicBP) +
        (BLOOD_TEST_COEFFICIENTS.DIABETES * (hasDiabetes ? 1 : 0)) +
        (BLOOD_TEST_COEFFICIENTS.CHOLESTEROL * totalCholesterol) +
        (BLOOD_TEST_COEFFICIENTS.SMOKING * (isSmoking ? 1 : 0));
};

export const calculateNonBloodTestScore = (
    age: number,
    sex: number,
    systolicBP: number,
    hasDiabetes: boolean,
    whr: number,
    isSmoking: boolean
): number => {
    return (NON_BLOOD_TEST_COEFFICIENTS.AGE * age) +
        (NON_BLOOD_TEST_COEFFICIENTS.SEX * sex) +
        (NON_BLOOD_TEST_COEFFICIENTS.SBP * systolicBP) +
        (NON_BLOOD_TEST_COEFFICIENTS.DIABETES * (hasDiabetes ? 1 : 0)) +
        (NON_BLOOD_TEST_COEFFICIENTS.WHR * whr) +
        (NON_BLOOD_TEST_COEFFICIENTS.SMOKING * (isSmoking ? 1 : 0));
};

export const calculateRiskFromScore = (score: number, intercept: number): number => {
    return (1 - Math.pow(SURVIVAL_ROOT, Math.exp(score - intercept))) * 100;
};

export const calculateRisk = (data: FormData): RiskResult => {
    const sex = data.gender === 'male' ? 1 : 0;
    const compareValues = getCompareValues(sex, data.age);
    let predictedRisk = 0;
    let compareRisk = 0;

    if (data.age > 1 && data.systolicBP >= 70) {
        if (data.useBloodTest && data.totalCholesterol) {
            const fullScore = calculateBloodTestScore(
                data.age,
                sex,
                data.systolicBP,
                data.hasDiabetes,
                data.totalCholesterol,
                data.isSmoking
            );

            const compareScore = calculateBloodTestScore(
                data.age,
                sex,
                compareValues.sbp,
                false,
                DEFAULT_VALUES.CHOLESTEROL,
                false
            );

            predictedRisk = calculateRiskFromScore(fullScore, BLOOD_TEST_COEFFICIENTS.INTERCEPT);
            compareRisk = calculateRiskFromScore(compareScore, BLOOD_TEST_COEFFICIENTS.INTERCEPT);

        } else if (data.waistCircumference && data.height) {
            const whr = data.waistCircumference / data.height;

            const fullScore = calculateNonBloodTestScore(
                data.age,
                sex,
                data.systolicBP,
                data.hasDiabetes,
                whr,
                data.isSmoking
            );

            const compareScore = calculateNonBloodTestScore(
                data.age,
                sex,
                compareValues.sbp,
                false,
                compareValues.whr,
                false
            );

            predictedRisk = calculateRiskFromScore(fullScore, NON_BLOOD_TEST_COEFFICIENTS.INTERCEPT);
            compareRisk = calculateRiskFromScore(compareScore, NON_BLOOD_TEST_COEFFICIENTS.INTERCEPT);
        }
    }

    return { predictedRisk, compareRisk };
};