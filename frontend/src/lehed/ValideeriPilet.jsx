import Päis from "./komponendid/Päis";
import {
  GlobalStyles,
  CssBaseline,
  Container,
  TextField,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";

export default function ValideeriPilet() {
  const defaultTheme = createTheme();
  const [andmed, setAndmed] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const id = data.get("id");
    const sendReg = async () => {
      try {
        const response = await fetch(`/api/valideeri/${id}`);

        if (response.ok) {
          setAndmed("Valideeritud, kehtiv kuni: ");
        } else {
          setAndmed("Pole enam valiidne");
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    sendReg();
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyles
          styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
        />
        <CssBaseline />

        <Päis />

        <Container maxWidth="sm" component="main" style={{ padding: "1rem" }}>
          <Typography variant="h3">Kontrolli piletit siin: </Typography>
          <Grid
            container
            direction="column"
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              id="id"
              name="id"
              label="Sisesta kood"
              variant="outlined"
              style={{ marginBottom: "20px" }}
            />
            <Button variant="contained" type="submit">
              Otsi
            </Button>

            {andmed && (
              <div>
                <Typography variant="h6" gutterBottom>
                  {andmed}
                </Typography>
              </div>
            )}
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
}
