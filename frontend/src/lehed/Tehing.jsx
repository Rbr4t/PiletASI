import { createTheme, ThemeProvider } from "@mui/material/styles";
import Päis from "./komponendid/Päis";
import { useState, useEffect } from "react";
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
  Alert,
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
    expiryDate: dayjs(new Date(new Date().setHours(0, 0, 0, 0))),
    cvv: "",
  });

  useEffect(() => {
    const getAndmed = async () => {
      try {
        const response = await fetch("/auth/get_user_info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setFormData({
          ...formData,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (sessionStorage.getItem("piletTüüp") == "kasutaja") {
      getAndmed();
    }
  });

  const [aboutBuy, setAboutBuy] = useState(false);

  const [formErrors, setFormErrors] = useState([]);

  const [countdown, setCountdown] = useState(5); // Initial countdown value
  const [buttonDisabled, setButtonDisabled] = useState(true); // Button state

  useEffect(() => {
    if (aboutBuy) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [aboutBuy]);

  useEffect(() => {
    if (countdown === 0) {
      setButtonDisabled(false);
    }
  }, [countdown]);

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

  const validateForm = () => {
    const errors = [];
    if (!formData.firstName.trim()) {
      errors.push("Eesnimi on kohustuslik");
    }
    if (!formData.lastName.trim()) {
      errors.push("Perekonnanimi on kohustuslik");
    }
    if (!formData.email.trim()) {
      errors.push("E-post on kohustuslik");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Palun sisestage korrektne e-posti aadress");
    }
    if (formData.cardNumber == "" || isNaN(formData.cardNumber)) {
      errors.push("Palun sisestage korrektne kaardi number");
    }
    if (
      formData.cardHolder == "" ||
      formData.cardHolder.split(" ").length == 1
    ) {
      errors.push("Palun sisestage korrektne kaardi omanik");
    }

    if (
      formData.expiryDate["$d"].getTime() <=
      dayjs(new Date(new Date().setHours(0, 0, 0, 0)))["$d"].getTime()
    ) {
      errors.push("Palun sisestage korrektne kestvus");
    }
    if (formData.cvv == "" || isNaN(formData.cvv)) {
      errors.push("Palun sisestage korrektne kaardi CVV");
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const v = validateForm();
    console.log(v);
    if (v) {
      setAboutBuy(true);
      console.log(formData);
    }
  };

  const handleSend = () => {
    console.log(localStorage.getItem("pilet"));

    window.location.href = "/";
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

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper} style={{ padding: 5 }}>
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
                    <TableCell>Väljumine:</TableCell>
                    <TableCell>{departureTimestamp.substring(0, 34)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Saabumine:</TableCell>
                    <TableCell>{arrivalTimestamp.substring(0, 34)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Transpordi id: </TableCell>
                    <TableCell>
                      {peatus.transport
                        .flatMap((transport) => transport.id)
                        .join(", ")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Hind:</TableCell>
                    <TableCell>{`${peatus.hind}€`}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Kestvus:</TableCell>
                    <TableCell>{duration} tundi</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper style={{ padding: 5 }}>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                {formErrors.length > 0 && (
                  <Alert severity="error">{formErrors[0]}</Alert>
                )}
                {aboutBuy ? (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={buttonDisabled}
                    onClick={handleSend}
                  >
                    {countdown > 0 ? `Kindel?: ${countdown}` : "Jah"}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Osta
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
