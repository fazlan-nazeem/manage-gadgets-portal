import React from 'react';
import Page from 'src/components/Page';
import { Container, makeStyles, Box } from '@material-ui/core';
import Result from './Result';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(4)
  }
}));

const GET_DEVICE_BY_ID = gql`
  query GET_DEVICE_BY_ID($id: ID!) {
    getDeviceById(id: $id) {
      id
      serialNumber
      model
      description
      vendor
      deviceStatus
      createdAt
      updatedAt
      warrantyExpiryDate
      purchaseDate
      deviceCategory {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
`;

const DeviceDetailedView = props => {
  const { id } = useParams();
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_DEVICE_BY_ID, {
    variables: {
      id
    }
  });

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(</p>;

  return (
    <Page className={classes.root} title="Devices Info">
      <Container maxWidth={false}>
        <Box mt={3}>
          <Result data={data}></Result>
        </Box>
      </Container>
    </Page>
  );
};

export default DeviceDetailedView;
