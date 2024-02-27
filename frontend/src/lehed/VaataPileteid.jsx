import { createTheme, ThemeProvider } from "@mui/material/styles";
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
  Button,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Delete as DeleteIcon } from "@mui/icons-material";

import Sõit from "./komponendid/Sõit";
import Päis from "./komponendid/Päis";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const getParameetrid = async () => {
  try {
    const response = await fetch("/api/saa_parameetrid");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    return [data.peatused, data.pilettypes];
  } catch (error) {
    console.error("Error:", error);
    // Handle error appropriately, e.g., show a message to the user
  }
};

const getPeatusedKõik = async () => {
  try {
    const response = await fetch("/api/saa_marsruudid");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log(response);
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export default function VaataPileteid() {
  const [peatused, setPeatused] = useState([]);
  const [piletiTüübid, setPiletiTüübid] = useState([]);
  const [piletiKohad, setPiletiKohad] = useState([]);
  const [piletTypeSearch, setPiletTypeSearch] = useState("");

  const [formAndmed, setFormAndmed] = useState({
    algus: null,
    lõpp: null,
    tüüp: "",
    lisaPeatused: [],
  });
  const [lisaPeatused, setLisaPeatused] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const inf = await getParameetrid();
      setPiletiTüübid(inf[1]);
      setPiletiKohad(inf[0]);

      const peatusedKõik = await getPeatusedKõik();
      console.log(peatusedKõik);
      setPeatused(peatusedKõik);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(lisaPeatused);
    setFormAndmed({ ...formAndmed, lisaPeatused: lisaPeatused });
  }, [lisaPeatused]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formAndmed);
  };

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
          onSubmit={handleSubmit}
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
                      value={piletTypeSearch}
                      label="Tüüp"
                      onChange={(e) => {
                        setPiletTypeSearch(e.target.value);
                        setFormAndmed({
                          ...formAndmed,
                          tüüp: e.target.value,
                        });
                      }}
                    >
                      <MenuItem value="">
                        <em>vali</em>
                      </MenuItem>
                      {piletiTüübid.map((v, index) => (
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
                    options={piletiKohad}
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
                    options={piletiKohad}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Sihtkoht" />
                    )}
                    onChange={(event, value) =>
                      setFormAndmed({ ...formAndmed, lõpp: value })
                    }
                  />
                </Grid>
                <Grid item>
                  <Grid container direction="column" justifyContent="end">
                    {lisaPeatused.map((peatus, index) => (
                      <Grid
                        key={index}
                        container
                        alignItems="center"
                        justifyContent="center"
                      >
                        <TextField
                          label={`Vahepeatus: ${index + 1}`}
                          value={lisaPeatused[index]}
                          onChange={(e) =>
                            setLisaPeatused(
                              lisaPeatused.map((v, i) =>
                                i === index ? e.target.value : v
                              )
                            )
                          }
                          margin="dense"
                        ></TextField>
                        <IconButton
                          onClick={() =>
                            setLisaPeatused(
                              lisaPeatused.filter((v, i) => i !== index)
                            )
                          }
                          alignItems="center"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                  <Grid
                    container
                    style={{ display: "flex", justifyContent: "end" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setLisaPeatused([...lisaPeatused, ""])}
                    >
                      Lisa vahepeatus
                    </Button>
                  </Grid>
                  <Button variant="contained" type="submit">
                    Otsi
                  </Button>
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
