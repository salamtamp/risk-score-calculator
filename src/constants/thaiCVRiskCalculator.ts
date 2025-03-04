export const SURVIVAL_ROOT = 0.964588;

export const BLOOD_TEST_COEFFICIENTS = {
    AGE: 0.08183,
    SEX: 0.39499,
    SBP: 0.02084,
    DIABETES: 0.69974,
    CHOLESTEROL: 0.00212,
    SMOKING: 0.41916,
    INTERCEPT: 7.04423
};

export const NON_BLOOD_TEST_COEFFICIENTS = {
    AGE: 0.079,
    SEX: 0.128,
    SBP: 0.019350987,
    DIABETES: 0.58454,
    WHR: 3.512566,
    SMOKING: 0.459,
    INTERCEPT: 7.712325
};

export const DEFAULT_VALUES = {
    COMPARE_SBP: {
        MALE_OVER_60: 132,
        FEMALE_UNDER_60: 115,
        FEMALE_OVER_60: 130,
        DEFAULT: 120
    },
    COMPARE_WHR: {
        MALE: 0.58125,
        FEMALE: 0.52667
    },
    COMPARE_WC: {
        MALE: 93,
        FEMALE: 79
    },
    CHOLESTEROL: 200
};

export const initialFormData = {
    age: 35,
    gender: 'male' as const,
    isSmoking: false,
    hasDiabetes: false,
    systolicBP: 120,
    useBloodTest: false,
    totalCholesterol: 0,
    waistCircumference: 0,
    height: 0,
};