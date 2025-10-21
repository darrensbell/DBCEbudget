import { AppBar, Toolbar, IconButton, Typography, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

function Header({ handleDrawerToggle }) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        [theme.breakpoints.up('md')]: {
            display: 'none' // Hide app bar on larger screens where nav is permanent
        }
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Theatre Budget App
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
