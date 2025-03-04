export interface FormData {
    age: number;
    gender: 'male' | 'female';
    isSmoking: boolean;
    hasDiabetes: boolean;
    systolicBP: number;
    useBloodTest: boolean;
    totalCholesterol?: number;
    waistCircumference?: number;
    height?: number;
}

export interface RiskResult {
    predictedRisk: number;
    compareRisk: number;
}

export interface CompareValues {
    sbp: number;
    whr: number;
    wc: number;
}