/* eslint-disable react/prop-types */
import Päis from "./komponendid/Päis";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  GlobalStyles,
  CssBaseline,
} from "@mui/material";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import "dayjs/locale/et";
import dayjs from "dayjs";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

async function isAdmin() {
  try {
    const response = await fetch("/auth/is_admin", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

function AdminRedigeeri() {
  const defaultTheme = createTheme();
  const { id } = useParams();
  const [transpordiVahendid, setTranspordiVahendid] = useState([]);

  const [formData, setFormData] = useState({
    transportType: "",
    customTransportType: "",
    price: "",
    stops: [{ id: 0, stop: "", timestamp: null }],
  });

  useEffect(() => {
    async function fetchMarsruudid() {
      try {
        const response = await fetch(`/api/saa_marsruut/${id}`);
        const data = await response.json();
        let stops = [];

        stops.push({
          id: data.stops.id,
          stop: data.stops.stop,
          timestamp: new Date(data.stops.timestamp),
        });

        setFormData({
          transportType: data.transportType,
          price: data.price,
          stops: stops,
          customTransportType: "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    async function saaParameetrid() {
      try {
        const response = await fetch(`/api/saa_parameetrid`); // Adjust URL as needed
        const data = await response.json();
        setTranspordiVahendid(data.pilettypes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (id !== "uus") {
      fetchMarsruudid();
    } else if (id === "uus") {
      saaParameetrid();
    }
  }, []);

  const [responseStatus, setResponseStatus] = useState(null);

  const sendData = async () => {
    console.log(formData);
    try {
      const response = await fetch("/api/genereeri_marsruut", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        window.location.href = "/admin/uus";
      }

      setResponseStatus(response.status);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddStop = () => {
    const newId =
      formData.stops.length > 0
        ? formData.stops[formData.stops.length - 1].id + 1
        : 0;
    setFormData({
      ...formData,
      stops: [...formData.stops, { id: newId, stop: "", timestamp: null }],
    });
  };

  const handleRemoveStop = (id) => {
    setFormData({
      ...formData,
      stops: formData.stops.filter((peatus) => peatus.id !== id),
    });
  };

  const handleStopChange = (id, field, value) => {
    const newStops = formData.stops.map((peatus) => {
      if (peatus.id === id) {
        return { ...peatus, [field]: value };
      }
      return peatus;
    });
    setFormData({
      ...formData,
      stops: newStops,
    });
  };

  const handleTransportTypeChange = (event) => {
    const value = event.target.value;

    if (formData.transportType === "+") {
      setFormData({
        ...formData,
        customTransportType: value,
      });
    } else {
      setFormData({
        ...formData,
        transportType: value,
      });
    }
  };

  const handleTimestampChange = (id, value) => {
    const newStops = formData.stops.map((peatus) => {
      if (peatus.id === id) {
        return { ...peatus, timestamp: value["$d"].toUTCString() };
      }
      return peatus;
    });
    setFormData({
      ...formData,
      stops: newStops,
    });
  };

  const handlePublish = () => {
    if (formData.customTransportType !== "") {
      formData.transportType = formData.customTransportType;
    }
    delete formData.customTransportType;

    sendData();
    setFormData({
      transportType: "",
      customTransportType: "",
      price: "",
      stops: [{ id: 0, stop: "", timestamp: null }],
    });
  };

  async function checkAdmin() {
    try {
      if (!(await isAdmin())) {
        window.location.href = "/";
        return <></>;
      }
    } catch {
      window.location.href = "/";
      return <></>;
    }
  }
  checkAdmin();

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyles
          styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
        />
        <CssBaseline />

        <Päis />

        <Container sx={{ pt: 8, pb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Lisa uus marsruut
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="transport-type-label">Marsruudi tüüp</InputLabel>
            <Select
              labelId="transport-type-label"
              id="transport-type"
              value={formData.transportType}
              onChange={handleTransportTypeChange}
              label="Type of Transportation"
            >
              {transpordiVahendid.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}

              <MenuItem value="+">+</MenuItem>
            </Select>
          </FormControl>
          {formData.transportType === "+" && (
            <TextField
              fullWidth
              id="custom-transport-type"
              label="Lisa uus transpordiviis"
              onChange={handleTransportTypeChange}
              sx={{ marginBottom: 2 }}
            />
          )}
          <TextField
            fullWidth
            id="price"
            label="Hind"
            value={formData.price}
            onChange={(e) =>
              /^-?[0-9]+(?:\.[0-9]+)?$/.test(e.target.value) ||
              e.target.value === ""
                ? setFormData({ ...formData, price: e.target.value })
                : null
            }
            sx={{ marginBottom: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            Peatused
          </Typography>

          {formData.stops.map((peatus, index) => (
            <Grid
              container
              key={index}
              padding={1}
              alignItems="center"
              justifyContent="start"
            >
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  id={`peatus-${peatus.id}`}
                  label={`Peatus ${index + 1}`}
                  value={peatus.peatus}
                  onChange={(e) =>
                    handleStopChange(peatus.id, "peatus", e.target.value)
                  }
                />
              </Grid>

              <Grid item>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="et"
                >
                  <DateTimePicker
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    value={dayjs(peatus.timestamp)}
                    onChange={(value) =>
                      handleTimestampChange(peatus.id, value)
                    }
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item alignItems="center" justifyContent="center">
                <IconButton onClick={() => handleRemoveStop(peatus.id)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Container
            style={{
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              marginTop: "1rem",
              justifyContent: "space-between",
            }}
          >
            <Button variant="outlined" onClick={handleAddStop}>
              Lisa peatus
            </Button>

            <Button variant="contained" onClick={handlePublish}>
              Lisa andmebaasi
            </Button>
          </Container>
          {responseStatus}
        </Container>
      </ThemeProvider>
    </>
  );
}
export default AdminRedigeeri;
