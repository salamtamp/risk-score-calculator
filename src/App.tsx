import { Container, Box } from '@mui/material';
import ThaiCVRiskCalculator from './components/ThaiCVRiskCalculator';

function App() {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <ThaiCVRiskCalculator />
            </Box>
        </Container>
    );
}

export default App;