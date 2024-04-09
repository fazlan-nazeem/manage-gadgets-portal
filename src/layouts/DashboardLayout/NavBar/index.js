import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Lock as LockIcon, UserPlus as UserPlusIcon } from 'react-feather';
import DeviceIcon from '@material-ui/icons/Devices';
import BuildIcon from '@material-ui/icons/Build';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CategoryIcon from '@material-ui/icons/Category';
import NavItem from './NavItem';
import { useAuthContext } from "@asgardeo/auth-react";

const items = [
  {
    href: '/app/dashboard',
    icon: DashboardIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/devices',
    icon: DeviceIcon,
    title: 'Devices'
  },
  {
    href: '/app/repairs',
    icon: BuildIcon,
    title: 'Repairs'
  },
  {
    href: '/app/categories',
    icon: CategoryIcon,
    title: 'Categories'
  }
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const { state, signIn, signOut } = useAuthContext();

  const loggedInUser = {
    avatar: "https://media-exp1.licdn.com/dms/image/C5603AQHXkCkz9RqgzQ/profile-displayphoto-shrink_800_800/0/1606624111534?e=1635984000&v=beta&t=yS6-hKm9OjyuYF2mqKslE7BfyugBOWjTHPquKZCJYFM" ,
    Company: "Engineer",
    name: state.username
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={loggedInUser.avatar}
          to="/app/account"
        />
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {loggedInUser.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {loggedInUser.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map(item => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
