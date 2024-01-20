import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';
import * as React from 'react';

export default function ButtonAppBar() { // MaterialUI appbar to use as header on every page
    // const {t, i18n} = useTranslation();
    // const changeLanguage = (language) => {
    //     i18n.changeLanguage(language)
    // } 
  return (
    <React.Suspense fallback="loading">
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            {/* <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
            > */}
            {/* </IconButton> */}
            <Button color="inherit" component={RouterLink} to="/"> Home</Button>
            <Button color="inherit" component={RouterLink} to="/about">About</Button> 
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            </Typography>
            
                
            
            <Button color="inherit" id="fi" >FI</Button>
            <Button color="inherit" id="en" >EN</Button>
            </Toolbar>
        </AppBar>
        </Box>
    </React.Suspense>
  );
}