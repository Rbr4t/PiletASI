import { AppBar, Toolbar, Typography, Button } from "@mui/material"
export default function Päis() {
    return (
        <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            ***
          </Typography>
          
          <Button href="/login" variant='contained' sx={{ my: 1, mx: 1.5 }}>
            Logi sisse
          </Button>
        </Toolbar>
      </AppBar>
    )
}