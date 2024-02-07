/* eslint-disable react/prop-types */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, ListItem, ListItemText, List, Link } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Sõit({liinid}) {
  const [expanded, setExpanded] = React.useState([]);

  const handleExpandClick = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  return (
    <>
    {liinid.map((liin, index) => (
        <Card key={index}>
            <CardHeader
                
                action={
                <IconButton>
                    <DirectionsBusIcon />
                </IconButton>
                }
                title={liin.peatused[0] + " - " + liin.peatused[liin.peatused.length - 1]}
                subheader={liin.kuupäev}
            />
            
            
            <CardActions disableSpacing>
                <Link href={`/piletid/${liin.id}`}>
                  <Button variant='contained'>
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
                <List >
                    {liin.peatused.map((d, index) => (
                        
                        <ListItem key={index}>
                            
                            <ListItemText
                            primary={`${d}`}
                            secondary={'kellaaeg'}
                            />
                        </ListItem>
                        
                    ))}
                </List>

                    
                
                </CardContent>
            </Collapse>
        </Card>
    ))}
    </>
  );
}