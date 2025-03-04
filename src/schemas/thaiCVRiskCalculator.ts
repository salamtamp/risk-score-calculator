import * as yup from 'yup';

export const calculatorSchema = yup.object({
    age: yup
        .number()
        .required('Age is required')
        .min(35, 'Age must be at least 35')
        .max(70, 'Age must not exceed 70'),
    systolicBP: yup
        .number()
        .required('Systolic blood pressure is required')
        .min(70, 'Systolic BP must be at least 70')
        .max(250, 'Systolic BP must not exceed 250'),
    totalCholesterol: yup
        .number()
        .when('useBloodTest', {
            is: true,
            then: (schema) => schema
                .required('Total cholesterol is required')
                .min(100, 'Total cholesterol must be at least 100')
                .max(400, 'Total cholesterol must not exceed 400'),
        }),
    waistCircumference: yup
        .number()
        .when('useBloodTest', {
            is: false,
            then: (schema) => schema
                .required('Waist circumference is required')
                .min(50, 'Waist circumference must be at least 50')
                .max(200, 'Waist circumference must not exceed 200'),
        }),
    height: yup
        .number()
        .when('useBloodTest', {
            is: false,
            then: (schema) => schema
                .required('Height is required')
                .min(120, 'Height must be at least 120')
                .max(220, 'Height must not exceed 220'),
        }),
    gender: yup.string().oneOf(['male', 'female']).required('Gender is required'),
    isSmoking: yup.boolean().required(),
    hasDiabetes: yup.boolean().required(),
    useBloodTest: yup.boolean().required(),
}).required();