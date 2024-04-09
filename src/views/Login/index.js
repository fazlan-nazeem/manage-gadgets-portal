import React from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = () => {
  const classes = useStyles();

  return (
    // <Page className={classes.root} title="Login">
    //   <Container maxWidth={false}>
    //     <Toolbar />
    //     <Box mt={3}>
    //       <Results />
    //     </Box>
    //   </Container>
    // </Page>
    <div className="container">
    <div className="header-title">
        <h1>
            React SPA Authentication Sample
        </h1>
    </div>
    {
        isLoading
            ? <div className="content">Loading ...</div>
            : hasErrors
                ? <div className="content">An error occured while authenticating ...</div>
                : children
    }
</div>

  );
};

export default CustomerListView;
