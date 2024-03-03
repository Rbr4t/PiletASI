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
  Chip,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function OstaPilet() {
  const { piletId } = useParams();
  const [pilet, setPilet] = useState(JSON.parse(localStorage.getItem("pilet")));
  const defaultTheme = createTheme();
  console.log(pilet.transport[0].stops);
  if (!pilet) {
    // Loading state or error state
    return <div>Loading...</div>; // You can improve this to show a loading spinner or error message
  }

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
              {JSON.parse(localStorage.getItem("sihtkohad")).join(" - ")}
            </Typography>

            <Card>
              <CardContent>
                <List>
                  {pilet.transport.map((d, index) => (
                    <Card
                      style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                      key={index}
                    >
                      <Chip color="info" label={d.id} variant="outlined" />
                      <Grid
                        container
                        justifyContent="space-around"
                        flex
                        flexDirection="column"
                      >
                        {d.stops.map((e, idx) => (
                          <Grid
                            container
                            item
                            key={idx}
                            justifyContent="space-between"
                          >
                            <Typography variant="h5">{e.stop}</Typography>
                            <Typography variant="h5">
                              {e.timestamp.replace("T", " ")}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Card>
                  ))}
                </List>

                <Typography>Hind: {pilet.hind}€</Typography>
              </CardContent>
            </Card>

            <Card>
              <Grid direction="row">
                <CardContent>
                  <Typography variant="subtitle1">Osta pilet: </Typography>
                  <Button href={`/osta/${piletId}`} variant="outlined">
                    Külalisena
                  </Button>

                  <Button
                    disabled={
                      sessionStorage.getItem("access_token") ? false : true
                    }
                    href={`/osta/${piletId}`}
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
