import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  TextField,
  Container,
  GlobalStyles,
  CssBaseline,
  Button,
  Autocomplete,
  Grid,
} from "@mui/material";
import { useState } from "react";

import Sõit from "./komponendid/Sõit";
import Päis from "./komponendid/Päis";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

let algusKohad = ["Nõo", "Tartu"];
let loppKohad = ["Nõo", "Tartu"];
let piletTüübid = ["Buss", "Rong", "Rakett"];

const peatused = [
  { peatused: ["Tartu", "Teaduspark", "Nõo", "Elva"], kuupäev: Date(), id: 1 },
  { peatused: ["Elva", "Nõo", "Tartu"], kuupäev: Date(), id: 2 },
];

export default function VaataPileteid() {
  const [formAndmed, setFormAndmed] = useState({
    algus: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormAndmed({
      ...formAndmed,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform form submission logic here, such as sending data to a server
    console.log(formAndmed);
    // Clear form fields after submission
    setFormAndmed({
      algus: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />

      <Päis />
      <br></br>

      <Container
        disableGutters
        maxWidth="md"
        component="main"
        sx={{ pt: 8, pb: 6 }}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <form
          noValidate
          autoComplete="off"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onSubmit={handleSubmit}
        >
          <Grid>
            <Grid container item marginBottom={1}>
              <Autocomplete
                disablePortal
                id="tyyp"
                options={piletTüübid}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Pileti tüüp" />
                )}
              />
            </Grid>

            <Grid container alignItems="center" item direction="row">
              <Autocomplete
                disablePortal
                id="algus"
                options={algusKohad}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Alguskoht" />
                )}
              />
              <ArrowForwardIosIcon></ArrowForwardIosIcon>
              <Autocomplete
                disablePortal
                id="lopp"
                options={loppKohad}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Sihtkoht" />
                )}
              />
            </Grid>
          </Grid>
        </form>

        <Container>
          <Sõit liinid={peatused} kuupäev={Date()} />
        </Container>
      </Container>
    </ThemeProvider>
  );
}
