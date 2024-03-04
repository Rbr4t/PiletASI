/* eslint-disable react/prop-types */
import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Button,
  ListItem,
  ListItemText,
  List,
  Link,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Typography,
  Container,
  Chip,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

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

function Pilet({ liinid, peatused }) {
  const [expanded, setExpanded] = useState([]);

  console.log(peatused);
  const handleExpandClick = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  return liinid.map((liin, index) => (
    <Card key={index}>
      <CardHeader
        action={
          <Container
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DirectionsBusIcon />
            <Typography>{liin.hind}€</Typography>
          </Container>
        }
        title={peatused.join(" - ")}
        subheader={
          <div>
            <Chip
              label={liin.transport
                .map((transport) => transport.id)
                .join(" -> ")}
            ></Chip>
            <Typography>
              {liin.transport[0].stops
                .filter((v) => v.stop == peatused[0])[0]
                .timestamp.replace("T", " ")}
            </Typography>
          </div>
        }
      ></CardHeader>

      <CardActions disableSpacing>
        <Link>
          <Button
            variant="contained"
            onClick={() => {
              localStorage.setItem("pilet", JSON.stringify(liin));
              localStorage.setItem("sihtkohad", JSON.stringify(peatused));
              window.location.href = `/piletid/${index}`;
            }}
          >
            Osta pilet
          </Button>
        </Link>

        <ExpandMore
          expand={expanded[index]}
          onClick={() => handleExpandClick(index)}
          aria-expanded={expanded[index]}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Peatused</Typography>
          <List>
            {liin.transport.map((d, index) => (
              <ListItem key={index}>
                <List>
                  {d.stops.map((stop, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={stop.stop}
                        secondary={stop.timestamp.replace("T", " ")}
                      />
                    </ListItem>
                  ))}
                </List>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Collapse>
    </Card>
  ));
}

export default function Sõit({ liinid, peatused }) {
  return (
    <List
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        marginTop: 0,
      }}
    >
      <Pilet liinid={liinid} peatused={peatused} />
    </List>
  );
}
