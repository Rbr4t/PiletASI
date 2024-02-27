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
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

async function getPeatused(id) {
  try {
    const response = await fetch(`/api/saa_marsruut/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Error:", error);
    return null; // Return null if there's an error
  }
}

export default function OstaPilet() {
  const { piletId } = useParams();
  const [peatus, setPeatus] = useState(null);
  const defaultTheme = createTheme();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPeatused(piletId);
      setPeatus(data);
    };

    fetchData();
  }, [piletId]); // Include piletId in the dependency array

  if (!peatus) {
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
              {peatus.stops.length > 0 &&
                peatus.stops[0].stop +
                  " - " +
                  peatus.stops[peatus.stops.length - 1].stop}
            </Typography>

            <Card>
              <CardContent>
                <List>
                  {peatus.stops.map((d, index) => (
                    <Grid container justifyContent="space-around" key={index}>
                      <Grid
                        container
                        item
                        xs={6}
                        direction="column"
                        justifyContent="s"
                        alignItems="start"
                      >
                        <Typography variant="h5">{d.stop}</Typography>
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
                        <Typography>{d.timestamp}</Typography>
                      </Grid>
                    </Grid>
                  ))}
                </List>

                <Typography>Hind: {peatus.price}€</Typography>
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
                    disabled={true}
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
