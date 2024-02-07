import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Päis from "./komponendid/Päis";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Paper, List, ListItem, Card } from "@mui/material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

// TODO: olenevalt kas on sisse loginud kasutaja või mitte, siis täida osad väljad juba ära (nimi, email, credit card jne)

export default function Tehing() {
  const { id } = useParams();

  // TODO: mingi api call serverile, et saada info pileti ID kaudu peatustest jms
  const peatused = [
    {
      peatused: ["Tartu", "Teaduspark", "Nõo", "Elva"],
      kuupäev: Date(),
      id: 1,
    },
    { peatused: ["Elva", "Nõo", "Tartu"], kuupäev: Date(), id: 2 },
  ];

  const peatus = peatused.filter((e) => e.id == id)[0];
  console.log(id);

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Päis />
      <Container component="main" maxWidth="lg">
        <CssBaseline />

        <List
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
          }}
        >
          <ListItem style={{ flex: 1 }}>
            <Paper
              style={{
                padding: 5,
                height: "100%",
              }}
            >
              {/* Content for the left box */}
              <Grid container alignItems="center" justifyItems="center">
                <Grid item>
                  <Typography variant="h3">
                    {peatus.peatused[0] +
                      " - " +
                      peatus.peatused[peatus.peatused.length - 1]}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>Väljumine: {peatus.kuupäev}</Typography>
                  <Typography>Transpordi id: {peatus.id}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </ListItem>

          <ListItem style={{ flex: 1 }}>
            <Paper style={{ padding: 5 }}>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="Eesnimi"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Perekonnanimi"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="E-mail"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Kaardi number"
                      name="kaartNum"
                      variant="outlined"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Kaardi Omanik"
                      name="omanik"
                      variant="outlined"
                      value={formData.cardHolder}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Kestev kuni"
                      name="kestevKuni"
                      variant="outlined"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      name="cvv"
                      variant="outlined"
                      value={formData.cvv}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Osta
                </Button>
              </Box>
            </Paper>
          </ListItem>
        </List>
      </Container>
    </ThemeProvider>
  );
}
