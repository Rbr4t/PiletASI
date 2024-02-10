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
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Päis from "./komponendid/Päis";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function IndexPage() {
  let marsruudid = [{}, {}];

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
        <Card sx={{ minWidth: 275 }}>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
            }}
          >
            {[1, 2, 3].map((value) => (
              <List
                item
                key={value}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <ListItem>
                  <ListItemText primary={`Line item ${value}`} />
                </ListItem>
                <List item style={{ display: "flex" }}>
                  <ListItem>
                    <IconButton aria-label="comment">
                      <EditIcon />
                    </IconButton>
                  </ListItem>
                  <ListItem>
                    <IconButton aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                </List>
              </List>
            ))}
          </List>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
