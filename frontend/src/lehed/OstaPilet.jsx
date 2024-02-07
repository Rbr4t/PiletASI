import Päis from "./komponendid/Päis";
import {
  GlobalStyles,
  CssBaseline,
  Container,
  List,
  Typography,
  Card,
  Grid,
  Button,
  CardContent,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function OstaPilet() {
  const { piletId } = useParams();
  const defaultTheme = createTheme();
  const [kood, setKood] = useState("");
  const [andmed, setAndmed] = useState(null);
  const [error, setError] = useState(null);

  // TODO: mingi api call serverile, et saada info pileti ID kaudu peatustest jms
  const peatused = [
    {
      peatused: ["Tartu", "Teaduspark", "Nõo", "Elva"],
      kuupäev: Date(),
      id: 1,
    },
    { peatused: ["Elva", "Nõo", "Tartu"], kuupäev: Date(), id: 2 },
  ];

  const peatus = peatused.filter((e) => e.id == piletId)[0];
  console.log(peatus);

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
        <GlobalStyles
          styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
        />
        <CssBaseline />

        <Päis />

        <Container
          disableGutters
          maxWidth="sm"
          component="main"
          sx={{ pt: 8, pb: 6 }}
        >
          <Grid alignItems="center" justifyContent="center">
            <Typography variant="h1">
              {peatus.peatused[0] +
                " - " +
                peatus.peatused[peatus.peatused.length - 1]}{" "}
            </Typography>

            <Card>
              <CardContent>
                
                <List>
                  {peatus.peatused.map((d, index) => (
                    <Grid container justifyContent="space-around" key={index}>
                      <Grid
                        container
                        item
                        xs={6}
                        direction="column"
                        justifyContent="s"
                        alignItems="start"
                      >
                        <Typography variant="h5">{d}</Typography>
                      </Grid>
                      <Grid
                        container
                        item
                        xs={6}
                        direction="column"
                        alignItems="end"
                        justifyContent="center"
                        paddingRight={5}
                      >
                        <Typography>kellaeg</Typography>
                      </Grid>
                    </Grid>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Card>
              <Grid direction="row">
                <CardContent>
                  <Typography variant="subtitle1">Osta pilet: </Typography>
                  <Button href={`/osta/${piletId}`} variant="outlined">
                    Külalisena
                  </Button>

                  {/* TODO: kontrolli kas kasutaja on sisse loginud */}
                  <Button
                    disabled={true}
                    href="/osta/${piletId}"
                    variant="contained"
                  >
                    Kasutajana
                  </Button>
                </CardContent>
              </Grid>
            </Card>
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
}
