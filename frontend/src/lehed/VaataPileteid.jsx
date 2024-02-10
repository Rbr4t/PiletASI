import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  TextField,
  Container,
  GlobalStyles,
  CssBaseline,
  Select,
  Autocomplete,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
} from "@mui/material";
import { useState, useEffect } from "react";

import Sõit from "./komponendid/Sõit";
import Päis from "./komponendid/Päis";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

let algusKohad = ["Nõo", "Tartu"];
let loppKohad = ["Nõo", "Tartu"];
let piletTüübid = ["buss", "rong", "rakett"];

const peatusedNäide = [
  {
    peatused: ["Tartu", "Teaduspark", "Nõo", "Elva"],
    kuupäev: Date(),
    id: 1,
    tüüp: "buss",
  },
  { peatused: ["Elva", "Nõo", "Tartu"], kuupäev: Date(), id: 2, tüüp: "rong" },
];

export default function VaataPileteid() {
  const [peatused, setPeatused] = useState(peatusedNäide);
  const [formAndmed, setFormAndmed] = useState({
    algus: null,
    lõpp: null,
    tüüp: "",
  });
  const [tüüp, setTüüp] = useState("");

  useEffect(() => {
    if (formAndmed.tüüp !== "") {
      setPeatused(
        peatusedNäide
          .filter((e) => e.tüüp === formAndmed.tüüp)
          .sort((date1, date2) => date1 > date2)
      );
    } else {
      setPeatused(peatusedNäide.sort((date1, date2) => date1 > date2));
    }
  }, [formAndmed.tüüp]);

  // TODO: teekonna planeerimine käib läbi serveri

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />

      <Päis />
      <br />

      <Container
        disableGutters
        maxWidth="lg"
        component="main"
        sx={{ pt: 8, pb: 6 }}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <form
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md="auto">
              <Grid
                container
                direction="column"
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <FormControl>
                    <InputLabel id="test-select-label">Tüüp</InputLabel>
                    <Select
                      sx={{ width: 300 }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={tüüp}
                      label="Tüüp"
                      onChange={(e) => {
                        setTüüp(e.target.value);
                        setFormAndmed({
                          ...formAndmed,
                          tüüp: e.target.value,
                        });
                      }}
                    >
                      <MenuItem value="">
                        <em>vali</em>
                      </MenuItem>
                      {piletTüübid.map((v, index) => (
                        <MenuItem key={index} value={v}>
                          {v}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Autocomplete
                    disablePortal
                    id="algus"
                    options={algusKohad}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Alguskoht" />
                    )}
                    onChange={(event, value) =>
                      setFormAndmed({ ...formAndmed, algus: value })
                    }
                  />
                </Grid>
                <Grid item>
                  <Autocomplete
                    disablePortal
                    id="lopp"
                    options={loppKohad}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Sihtkoht" />
                    )}
                    onChange={(event, value) =>
                      setFormAndmed({ ...formAndmed, lõpp: value })
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md="8">
              <Container>
                <Sõit liinid={peatused} kuupäev={Date()} />
              </Container>
            </Grid>
          </Grid>
        </form>
      </Container>
    </ThemeProvider>
  );
}
