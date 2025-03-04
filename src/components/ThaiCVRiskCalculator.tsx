import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Button,
    Switch,
    Alert,
    Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormData, RiskResult } from '../types/thaiCVRiskCalculator';
import { initialFormData } from '../constants/thaiCVRiskCalculator';
import { calculatorSchema } from '../schemas/thaiCVRiskCalculator';
import { calculateRisk } from '../utils/thaiCVRiskCalculator';

const ThaiCVRiskCalculator = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(calculatorSchema),
        defaultValues: initialFormData,
    });
    const useBloodTest = watch('useBloodTest');
    const [riskResult, setRiskResult] = useState<RiskResult | null>(null);

    const onSubmit = (data: FormData) => {
        const result = calculateRisk(data);
        setRiskResult(result);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Thai CV Risk Calculator
            </Typography>

            <Box component="form" sx={{ mt: 3 }}>
                <Stack spacing={3}>
                    <TextField
                        {...register('age')}
                        label="Age"
                        type="number"
                        fullWidth
                        margin="normal"
                        error={!!errors.age}
                        helperText={errors.age?.message}
                    />

                    <FormControl component="fieldset">
                        <Typography variant="subtitle1">Gender</Typography>
                        <RadioGroup
                            {...register('gender')}
                            row
                        >
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                        </RadioGroup>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                {...register('isSmoking')}
                            />
                        }
                        label="Smoking"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                {...register('hasDiabetes')}
                            />
                        }
                        label="Diabetes"
                    />

                    <TextField
                        {...register('systolicBP')}
                        label="Systolic Blood Pressure"
                        type="number"
                        fullWidth
                        error={!!errors.systolicBP}
                        helperText={errors.systolicBP?.message}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                {...register('useBloodTest')}
                            />
                        }
                        label="Use Blood Test Results"
                    />

                    {useBloodTest ? (
                        <TextField
                            {...register('totalCholesterol')}
                            label="Total Cholesterol"
                            type="number"
                            fullWidth
                            error={!!errors.totalCholesterol}
                            helperText={errors.totalCholesterol?.message}
                        />
                    ) : (
                        <>
                            <TextField
                                {...register('waistCircumference')}
                                label="Waist Circumference (cm)"
                                type="number"
                                fullWidth
                                error={!!errors.waistCircumference}
                                helperText={errors.waistCircumference?.message}
                            />

                            <TextField
                                {...register('height')}
                                label="Height (cm)"
                                type="number"
                                fullWidth
                                error={!!errors.height}
                                helperText={errors.height?.message}
                            />
                        </>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={handleSubmit(onSubmit)}
                    >
                        Calculate Risk
                    </Button>
                </Stack>
            </Box>

            {riskResult && (
                <Box sx={{ mt: 3 }}>
                    <Alert severity={riskResult.predictedRisk > 30 ? "error" : "info"}>
                        <Typography variant="h6">Risk Assessment Results</Typography>
                        <Typography>
                            Your CV risk: {riskResult.predictedRisk > 30
                                ? "More than 30%"
                                : `${riskResult.predictedRisk.toFixed(2)}%`}
                        </Typography>
                        <Typography>
                            Optimal CV risk: {riskResult.compareRisk.toFixed(2)}%
                        </Typography>
                    </Alert>
                </Box>
            )}

            <Typography variant="caption" sx={{ display: 'block', mt: 3 }}>
                Disclaimer: This calculator is based on the Thai CV Risk Score developed by Faculty of Medicine Ramathibodi Hospital, Mahidol University. Results should be interpreted by healthcare professionals.
            </Typography>
        </Paper>
    );
};

export default ThaiCVRiskCalculator;