import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useAuthContext } from "@asgardeo/auth-react";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { state, signIn, signOut } = useAuthContext();
  return (
    <Page className={classes.root} title="Login">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Box mb={3}>
            <Typography color="textPrimary" variant="h2" align="center">
              Welcome to Manage Gadgets! 
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
              align="center"
            >
              Manage all your company gadgets within a unified platform
            </Typography>
          </Box>

          <Box 
            textAlign="center"
            >
            <img
              className={classes.image}
              src="static/manage-gadget-home.jpeg"
            />
          </Box>
          <Box my={2} textAlign="center">
            <Button
              color="primary"
              size="medium"
              type="submit"
              variant="contained"
              onClick={ () => signIn() }
            >
              Sign in
            </Button>
          </Box>
          <Typography color="textSecondary" variant="body2" textAlign="center">
            For demo account use "john@abc.com" as the username and "hba4vkd4hrd_PDM3ezk" as the password
          </Typography>
           
  
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
