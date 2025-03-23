import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';

const navVariants = {
  hover: { scale: 1.1, color: '#ff4081', transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

const buttonVariants = {
  hover: { scale: 1.05, backgroundColor: '#ff4081', transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

const logoVariants = {
  hover: { scale: 1.05, textShadow: '0 0 10px #ff4081', transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { text: 'Interview', path: '/interview' },
    { text: 'Resume', path: '/resume' },
    { text: 'Job Matching', path: '/job-matching' },
    { text: 'Cover Letter', path: '/cover-letter' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{ width: 250, bgcolor: '#1e1e1e', height: '100%', p: 2 }}
      onClick={handleDrawerToggle}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#00e5ff',
          fontWeight: 'bold',
          textShadow: '0 0 8px rgba(0, 229, 255, 0.8)',
          mb: 2,
        }}
      >
        EchoMentor
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              color: location.pathname === item.path ? '#ff4081' : '#b0bec5',
              '&:hover': { color: '#ff4081' },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{ bgcolor: '#121212', boxShadow: '0 4px 20px rgba(0, 229, 255, 0.1)' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 3 } }}>
        {/* Aesthetic Text Logo */}
        <motion.div variants={logoVariants} whileHover="hover" whileTap="tap">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#00e5ff',
                fontWeight: 'bold',
                fontFamily: 'Roboto, sans-serif', // Or use a custom font like 'Orbitron'
                letterSpacing: 1.5,
                textShadow: '0 0 8px rgba(0, 229, 255, 0.8)', // Neon glow
              }}
            >
              EchoMentor
            </Typography>
          </Link>
        </motion.div>

        {/* Desktop Nav Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          {navItems.map((item) => (
            <motion.div
              key={item.text}
              variants={navVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? '#ff4081' : '#b0bec5',
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {item.text}
              </Button>
            </motion.div>
          ))}
        </Box>

        {/* CTA Button (Desktop) */}
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            variant="contained"
            color="secondary"
            sx={{
              display: { xs: 'none', md: 'block' },
              bgcolor: '#00e5ff',
              color: '#121212',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#ff4081' },
            }}
            component={Link}
            to="/interview"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Mobile Menu Icon */}
        <IconButton
          color="inherit"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' }, color: '#00e5ff' }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { md: 'none' } }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;