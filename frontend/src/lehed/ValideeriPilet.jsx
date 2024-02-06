import Päis from "./komponendid/Päis"
import { GlobalStyles, CssBaseline, Container, TextField, Button, Typography, Grid } from "@mui/material"
import { createTheme, ThemeProvider} from '@mui/material/styles';
import { useState } from "react";

export default function ValideeriPilet() {
    const defaultTheme = createTheme();
    const [kood, setKood] = useState('');
    const [andmed, setAndmed] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setKood(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // fetchData();
      };

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
                <CssBaseline />
                
                <Päis />

                <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
                    <Typography variant="h3">Kontrolli piletit siin: </Typography>
                    <Grid container direction="column">
                        <TextField
                            label="Sisesta kood"
                            variant="outlined"
                            value={kood}
                            onChange={handleChange}
                            style={{ marginBottom: '20px' }}
                        />
                        <Button variant="contained" onClick={handleSubmit}>
                            Otsi
                        </Button>
                        {error && <Typography variant="body1" color="error">Error: {error}</Typography>}
                        {andmed && (
                            <div>
                            <Typography variant="h6" gutterBottom>Data:</Typography>
                            
                            </div>
                        )}
                    </Grid>
                    
                </Container>
                
            
            </ThemeProvider>
        </>
    )
}