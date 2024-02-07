import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  CardActionArea,
  CardMedia,
  Link,
  Card,
  CardContent,
  CssBaseline,
  Grid,
  Typography,
  GlobalStyles,
  Container,
} from "@mui/material";

import transport from "../meedia/transport.jpg";
import luup from "../meedia/luup.jpg";
import Päis from "./komponendid/Päis";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function IndexPage() {
  return (
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
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Vali tegevus:
        </Typography>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={5}
        >
          <Link href="/piletid">
            <Card sx={{ width: 265 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height={140}
                  width={250}
                  image={transport}
                  alt="transport piletid"
                />
                <CardContent>
                  <Link href="">
                    <Typography gutterBottom variant="h5" component="div">
                      Otsi pileteid
                    </Typography>
                  </Link>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>

          <Link href="/valideeri">
            <Card sx={{ width: 265 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height={140}
                  width={250}
                  image={luup}
                  alt="transport valideerimine"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Kontrolli piletit
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
