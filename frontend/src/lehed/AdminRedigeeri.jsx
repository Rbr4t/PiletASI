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

import { useState } from "react";

let transpordiVahendid = ["buss", "rong", "lennuk"];

function AdminRedigeeri() {
  const defaultTheme = createTheme();

  const [formData, setFormData] = useState({
    transportType: "",
    customTransportType: "",
    price: "",
    stops: [{ id: 0, stop: "", timestamp: null }],
  });

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
      stops: formData.stops.filter((stop) => stop.id !== id),
    });
  };

  const handleStopChange = (id, field, value) => {
    const newStops = formData.stops.map((stop) => {
      if (stop.id === id) {
        return { ...stop, [field]: value };
      }
      return stop;
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
    const newStops = formData.stops.map((stop) => {
      if (stop.id === id) {
        return { ...stop, timestamp: value["$d"] };
      }
      return stop;
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

    // Add your logic to publish the form data
    console.log(formData);

    setFormData({
      transportType: "",
      customTransportType: "",
      price: "",
      stops: [{ id: 0, stop: "", timestamp: null }],
    });
  };

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

          {formData.stops.map((stop, index) => (
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
                  id={`stop-${stop.id}`}
                  label={`Peatus ${index + 1}`}
                  value={stop.stop}
                  onChange={(e) =>
                    handleStopChange(stop.id, "stop", e.target.value)
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
                    value={stop.timestamp}
                    onChange={(value) => handleTimestampChange(stop.id, value)}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item alignItems="center" justifyContent="center">
                <IconButton onClick={() => handleRemoveStop(stop.id)}>
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
        </Container>
      </ThemeProvider>
    </>
  );
}
export default AdminRedigeeri;
