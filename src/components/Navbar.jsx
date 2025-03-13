import React, { useState } from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1a1a2e 0%, #2a2a40 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
}));

const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    background: 'rgba(108, 92, 231, 0.1)',
  },
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width:768px)');
  const open = Boolean(anchorEl);

  const routes = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/disease-info', label: 'Disease Info' },
    { path: '/about', label: 'About' },
    
    
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: '700',
            textDecoration: 'none',
            background: 'linear-gradient(45deg, #6c5ce7 0%, #4ecdc4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
         HealthTech 4 Africa
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={open}
              onClose={handleMenuClose}
            >
              {routes.map((route) => (
                <MenuItem
                  key={route.path}
                  component={Link}
                  to={route.path}
                  onClick={handleMenuClose}
                  sx={{
                    '&:hover': {
                      background: 'linear-gradient(45deg, #6c5ce722 0%, #4ecdc422 100%)',
                    },
                  }}
                >
                  {route.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box>
            {routes.map((route) => (
              <NavButton
                key={route.path}
                color="inherit"
                component={Link}
                to={route.path}
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    color: '#6c5ce7',
                  },
                }}
              >
                {route.label}
              </NavButton>
            ))}
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;