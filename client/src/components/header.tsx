import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';
import * as React from 'react';
import { Menu, MenuItem } from '@mui/material';
import BoyOutlinedIcon from '@mui/icons-material/BoyOutlined';
import "../css/header.css"
import { useTranslation } from 'react-i18next';
import background_image from "../assets/ai-background.jpg"

export default function ButtonAppBar() { // MaterialUI appbar to use as header on every page
  const { t, i18n } = useTranslation();
  const handlechangeLanguage = (language: string) => { // handle language change to FI or EN
    i18n.changeLanguage(language)
  }
  const appBarStyle = {
    backgroundColor: 'green', // Set the background color to green

  };
  React.useEffect(() => { // setting background image to all pages
    document.documentElement.style.height = '100vh';
    document.body.style.height = '100vh';
    document.body.style.background = `url(${background_image}) no-repeat center center fixed`
    document.body.style.backgroundSize = '100% 100%'
  }, [])
  const token: string | null = window.localStorage.getItem("auth_token");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // material ui appbar settings https://mui.com/material-ui/react-app-bar/
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {

    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Suspense fallback="loading">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={appBarStyle}>
          <Toolbar sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'space-between' },
            minHeight: { xs: 'auto', sm: '64px' }
          }}>


            <Button color="inherit" component={RouterLink} to="/"> {t('Home')}</Button>
            <Button color="inherit" component={RouterLink} to="/Swipe">{t('Start Swiping')}</Button>
            {token == null && (<Button color="inherit" component={RouterLink} to="/login">{t('Login')}</Button>)}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Finder
            </Typography>



            {token && token.length != 0 && (<div>
              <Button
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color='inherit'
              >
                <BoyOutlinedIcon />
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuItem onClick={() => { window.location.replace("/Profile") }}>{t('Profile')}</MenuItem>
                <MenuItem onClick={() => { window.location.replace("/Chat") }}>{t('Chats')}</MenuItem>
                <MenuItem onClick={() => { window.location.replace("/Login"); window.localStorage.removeItem("auth_token") }}>{t('Logout')}</MenuItem>
              </Menu>
            </div>)}
            <Button color="inherit" id="fi" onClick={() => { handlechangeLanguage("fi") }}>FI</Button>
            <Button color="inherit" id="en" onClick={() => { handlechangeLanguage("en") }}>EN</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </React.Suspense>
  );
}