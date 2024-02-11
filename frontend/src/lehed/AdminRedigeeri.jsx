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

import { useState, useEffect } from "react";

// TODO: võta vahendid andmebaasist
let transpordiVahendid = ["buss", "rong", "lennuk"];

function AdminRedigeeri() {
  const defaultTheme = createTheme();

  // TODO: võta andmed andmebaasist, kui on olemas
  const [responseStatus, setResponseStatus] = useState(null);
  const [formData, setFormData] = useState({
    tyyp: "",
    customTransportType: "",
    hind: "",
    peatused: [{ id: 0, peatus: "", aeg: null }],
  });

  const sendData = async () => {
    console.log(formData);
    try {
      const response = await fetch("/api/genereeri_marsruut", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setResponseStatus(response.status);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddStop = () => {
    const newId =
      formData.peatused.length > 0
        ? formData.peatused[formData.peatused.length - 1].id + 1
        : 0;
    setFormData({
      ...formData,
      peatused: [...formData.peatused, { id: newId, peatus: "", aeg: null }],
    });
  };

  const handleRemoveStop = (id) => {
    setFormData({
      ...formData,
      peatused: formData.peatused.filter((peatus) => peatus.id !== id),
    });
  };

  const handleStopChange = (id, field, value) => {
    const newStops = formData.peatused.map((peatus) => {
      if (peatus.id === id) {
        return { ...peatus, [field]: value };
      }
      return peatus;
    });
    setFormData({
      ...formData,
      peatused: newStops,
    });
  };

  const handleTransportTypeChange = (event) => {
    const value = event.target.value;

    if (formData.tyyp === "+") {
      setFormData({
        ...formData,
        customTransportType: value,
      });
    } else {
      setFormData({
        ...formData,
        tyyp: value,
      });
    }
  };

  const handleTimestampChange = (id, value) => {
    const newStops = formData.peatused.map((peatus) => {
      if (peatus.id === id) {
        return { ...peatus, aeg: value["$d"].toUTCString() };
      }
      return peatus;
    });
    setFormData({
      ...formData,
      peatused: newStops,
    });
  };

  const handlePublish = () => {
    if (formData.customTransportType !== "") {
      formData.tyyp = formData.customTransportType;
    }
    delete formData.customTransportType;

    // Add your logic to publish the form data
    console.log(formData);
    sendData();
    setFormData({
      tyyp: "",
      customTransportType: "",
      hind: "",
      peatused: [{ id: 0, peatus: "", aeg: null }],
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
              value={formData.tyyp}
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
          {formData.tyyp === "+" && (
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
            id="hind"
            label="Hind"
            value={formData.hind}
            onChange={(e) =>
              /^-?[0-9]+(?:\.[0-9]+)?$/.test(e.target.value) ||
              e.target.value === ""
                ? setFormData({ ...formData, hind: e.target.value })
                : null
            }
            sx={{ marginBottom: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            Peatused
          </Typography>

          {formData.peatused.map((peatus, index) => (
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
                    value={peatus.aeg}
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
