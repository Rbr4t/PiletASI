/* eslint-disable react/prop-types */
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  CardActions,
  Collapse,
  Card,
  CardContent,
  CssBaseline,
  Grid,
  GlobalStyles,
  Container,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Päis from "./komponendid/Päis";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "@emotion/styled";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

import { useState } from "react";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const Cell = ({ cell1, cell2 }) => {
  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell align="justify">{cell1}</TableCell>
      <TableCell align="justify">{cell2}</TableCell>
    </TableRow>
  );
};

const calcMinutes = (datetime1, datetime2) => {
  return (
    Math.round(
      (Math.abs(new Date(datetime2) - new Date(datetime1)) % 86400000) % 3600000
    ) / 60000
  );
};
let marsruudidNäide = [
  {
    id: 1,
    transportType: "buss",
    price: "50",
    stops: [
      {
        id: 0,
        stop: "Tartu",
        timestamp: "2024-02-16T11:00:00.000Z",
      },
      {
        id: 1,
        stop: "Nõo",
        timestamp: "2024-02-10T11:10:00.000Z",
      },
      {
        id: 2,
        stop: "Elva",
        timestamp: "2024-02-10T11:24:00.000Z",
      },
    ],
  },
  {
    id: 2,
    transportType: "rong",
    price: "60",
    stops: [
      {
        id: 0,
        stop: "Tartu",
        timestamp: "2024-02-10T12:00:00.000Z",
      },
      {
        id: 1,
        stop: "Nõo",
        timestamp: "2024-02-10T12:10:00.000Z",
      },
    ],
  },
];

export default function IndexPage() {
  const [expanded, setExpanded] = useState([]);
  const [marsruudid, setMarsruudid] = useState(marsruudidNäide);

  const handleExpandClick = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  const deleteMarsruut = (id) => {
    setMarsruudid(marsruudid.filter((e) => e.id != id));
  };

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
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
          }}
        >
          {marsruudid.map((marsruut, index) => (
            <Card key={marsruut.id}>
              <List
                item
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <ListItem
                  style={{ display: "flex", gap: "1rem", alignItems: "center" }}
                >
                  <DirectionsBusIcon></DirectionsBusIcon>

                  <ListItemText primary={`Marsruut ${marsruut.id}`} />
                </ListItem>
                <List item style={{ display: "flex" }}>
                  <ListItem>
                    <IconButton
                      aria-label="edit"
                      href={`/admin/${marsruut.id}`}
                    >
                      <EditIcon />
                    </IconButton>
                  </ListItem>
                  <ListItem>
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteMarsruut(marsruut.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                  <ListItem>
                    <CardActions disableSpacing>
                      <ExpandMore
                        expand={expanded[index]}
                        onClick={() => handleExpandClick(index)}
                        aria-expanded={expanded[index]}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </CardActions>
                  </ListItem>
                </List>
              </List>

              <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
                <CardContent>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                      <TableBody>
                        <Cell cell1="id" cell2={marsruut.id} />
                        <Cell
                          cell1="transpordi tüüp"
                          cell2={marsruut.transportType}
                        />

                        <Cell cell1="hind" cell2={marsruut.price} />
                        <Cell
                          cell1="marsruut"
                          cell2={`${marsruut.stops[0].stop} - ${
                            marsruut.stops[marsruut.stops.length - 1].stop
                          } `}
                        />
                        <Cell
                          cell1="kestvus"
                          cell2={`${calcMinutes(
                            marsruut.stops[0].timestamp,
                            marsruut.stops[marsruut.stops.length - 1].timestamp
                          )} min`}
                        />
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Collapse>
            </Card>
          ))}
        </List>
        <Grid container style={{ display: "flex", justifyContent: "end" }}>
          <Button href="/admin/uus" variant="contained">
            Lisa uus
          </Button>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
