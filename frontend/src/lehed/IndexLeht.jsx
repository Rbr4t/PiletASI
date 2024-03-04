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
import admin from "../meedia/admin.png";
import Päis from "./komponendid/Päis";
import { useEffect, useState } from "react";

const defaultTheme = createTheme();

async function isAdmin() {
  try {
    const response = await fetch("/auth/is_admin", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    });
    const ans = await response.json();

    if (!response.ok) {
      return false;
    }
    return ans;
  } catch (error) {
    return false;
  }
}

export default function IndexPage() {
  const [adminPerms, setAdminPerms] = useState(false);
  useEffect(() => {
    const e = async () => {
      const perms = await isAdmin();
      setAdminPerms(perms);
    };
    e();
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <Päis />

      <Container disableGutters component="main" sx={{ pt: 8, pb: 6 }}>
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
                  <Typography gutterBottom variant="h5" component="div">
                    Otsi pileteid
                  </Typography>
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

          {adminPerms ? (
            <Link href="/admin">
              <Card sx={{ width: 265 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height={140}
                    width={250}
                    image={admin}
                    alt="admin"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Admini paneel
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          ) : null}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
