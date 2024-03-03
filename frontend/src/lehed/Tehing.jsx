import { createTheme, ThemeProvider } from "@mui/material/styles";
import Päis from "./komponendid/Päis";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Paper,
  List,
  ListItem,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

// TODO: olenevalt kas on sisse loginud kasutaja või mitte, siis täida osad väljad juba ära (nimi, email, credit card jne)

export default function Tehing() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cardNumber: "",
    cardHolder: "",
    expiryDate: dayjs(new Date().setFullYear(new Date().getFullYear() + 2)),
    cvv: "",
  });

  const peatus = JSON.parse(localStorage.getItem("pilet"));
  const sihtkohad = JSON.parse(localStorage.getItem("sihtkohad"));

  if (!peatus || !sihtkohad) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleExpiryChange = (newDate) => {
    setFormData({
      ...formData,
      expiryDate: newDate,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  const departureTimestamp = peatus.transport[0].stops.find(
    (v) => v.stop === sihtkohad[0]
  ).timestamp;
  const arrivalTimestamp = peatus.transport[
    peatus.transport.length - 1
  ].stops.find((v) => v.stop === sihtkohad[sihtkohad.length - 1]).timestamp;

  const duration = dayjs(arrivalTimestamp).diff(
    dayjs(departureTimestamp),
    "hour"
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <Päis />
      <Container component="main" maxWidth="lg">
        <CssBaseline />

        <List
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
          }}
        >
          <List item>
            <TableContainer
              component={Paper}
              style={{ padding: 5, height: "100%" }}
            >
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Typography variant="h3">
                        {sihtkohad.join(" - ")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography>Väljumine:</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {departureTimestamp.substring(0, 34)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography>Saabumine:</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {arrivalTimestamp.substring(0, 34)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography>Transpordi id: </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {peatus.transport
                          .flatMap((transport) => transport.id)
                          .join(", ")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography>Hind:</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{`${peatus.hind}€`}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography>Kestvus:</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{duration} hours</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </List>

          <ListItem style={{ flex: 1 }}>
            <Paper style={{ padding: 5 }}>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="Eesnimi"
                      autoFocus
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Perekonnanimi"
                      name="lastName"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="E-mail"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="cardNumber"
                      label="Kaardi number"
                      name="cardNumber"
                      variant="outlined"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="cardHolder"
                      label="Kaardi Omanik"
                      name="cardHolder"
                      variant="outlined"
                      value={formData.cardHolder}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Kestev kuni"
                        value={formData.expiryDate}
                        onChange={(newDate) => handleExpiryChange(newDate)}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      id="cvv"
                      name="cvv"
                      variant="outlined"
                      value={formData.cvv}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Osta
                </Button>
              </Box>
            </Paper>
          </ListItem>
        </List>
      </Container>
    </ThemeProvider>
  );
}
