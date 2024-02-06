import Päis from "./komponendid/Päis"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GlobalStyles, CssBaseline, Container } from "@mui/material";

export default function AdminLeht() {
    const defaultTheme = createTheme();

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
            <CssBaseline />
            
            <Päis />

            <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
                


                
                
            </Container>
            
                
            </ThemeProvider>
        </>
    )
}