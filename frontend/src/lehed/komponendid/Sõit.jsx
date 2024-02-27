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
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

export default function Sõit({ liinid }) {
  const [expanded, setExpanded] = React.useState([]);

  const handleExpandClick = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };
  console.log(liinid);

  return (
    <List
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        marginTop: 0,
      }}
    >
      {liinid.map((liin, index) => (
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
                <Typography>{liin.price}</Typography>
              </Container>
            }
            title={
              liin.stops[0].stop +
              " - " +
              liin.stops[liin.stops.length - 1].stop
            }
            subheader={liin.timestamp}
          />

          <CardActions disableSpacing>
            <Link href={`/piletid/${liin.id}`}>
              <Button variant="contained">Osta pilet</Button>
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
                {liin.stops.map((d, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={d.stop} secondary={d.timestamp} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Collapse>
        </Card>
      ))}
    </List>
  );
}
