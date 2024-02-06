import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { CardActionArea, CardMedia, Link } from '@mui/material';

import transport from '../meedia/transport.jpg'
import luup from '../meedia/luup.jpg'
import Päis from './komponendid/Päis';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function IndexPage() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <Päis />

      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Vali tegevus:
        </Typography>

        <Grid container direction="row" justifyContent="center" alignItems="center" gap={5} >

          <Link href="/osta">

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
                        Osta pilet
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
            
        </Grid>
        
      </Container>
     
        
    </ThemeProvider>
  );
}