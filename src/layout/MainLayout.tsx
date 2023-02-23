import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink, useLocation } from "react-router-dom";

import DeveloperBoardOutlinedIcon from '@mui/icons-material/DeveloperBoardOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import EmojiTransportationOutlinedIcon from '@mui/icons-material/EmojiTransportationOutlined';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const MenuItem = ({ to, title, icon }: { to: string; title: string; icon: React.ReactNode; }) => {
  const location = useLocation();
  const isSelected = location.pathname.includes(to);

  return (
    <ListItem disablePadding role={undefined}>
      <ListItemButton color="inherit" component={RouterLink} to={to} selected={isSelected}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
};

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export const MainLayout = ({ title, children }: any) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    document.title = title;
  }, [title]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="body1" noWrap component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>

          <MenuItem to="/sales" title="Ventas" icon={<ShoppingCartCheckoutIcon />} />
          <MenuItem to="/products" title="Productos" icon={<InventoryOutlinedIcon />} />
          <MenuItem to="/shopping" title="Compras" icon={<AddBusinessIcon />} />
          <MenuItem to="/providers" title="Proveedores" icon={<EmojiTransportationOutlinedIcon />} />
          <MenuItem to="/brands" title="Marcas" icon={<DeveloperBoardOutlinedIcon />} />
          <MenuItem to="/places" title="Ubicaciones" icon={<PinDropOutlinedIcon />} />

        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};