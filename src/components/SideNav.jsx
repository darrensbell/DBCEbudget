import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, useTheme, useMediaQuery, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function SideNav({ drawerWidth, mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItemButton component={NavLink} to="/" onClick={isMobile ? handleDrawerToggle : null}>
            <ListItemIcon>
              <DashboardIcon sx={{ color: 'primary.main' }}/>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={NavLink} to="/budget/new" onClick={isMobile ? handleDrawerToggle : null}>
            <ListItemIcon>
              <AddCircleOutlineIcon sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText primary="New Production" />
          </ListItemButton>
        </List>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'background.default' },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'background.default', borderRight: '1px solid rgba(255, 255, 255, 0.12)' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
}

export default SideNav;
