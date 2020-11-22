import React, { useState } from 'react';

import PropTypes from 'prop-types';

import {
  makeStyles,
  Card,
  Grid,
  GridList,
  CardContent,
  ListSubheader,
  TextField,
  Paper,
  GridListTile,
  FormControl,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useMutation, useQuery, gql } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  avatar: {
    marginRight: theme.spacing(2)
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(6)
    }
  },
  gridList: {
    height: '100%'
  },
  select: {
    marginTop: theme.spacing(1)
  },
  deviceStatus: {
    fontSize: '16',
    color: 'Green'
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const GET_DEVICE_CATEGORIES = gql`
  query GET_DEVICE_CATEGORIES {
    getDeviceCategories(pageSize: 20) {
      deviceCategories {
        id
        name
      }
    }
  }
`;

const ADD_DEVICE_ASSIGNMENT = gql`
  mutation ADD_DEVICE_ASSIGNMENT($input: DeviceAssignmentInput!) {
    addOrUpdateDeviceAssignment(input: $input) {
      deviceId
      name
      email
      location
    }
  }
`;

const DELETE_DEVICE_ASSIGNMENT = gql`
  mutation DELETE_DEVICE_ASSIGNMENT($id: ID!) {
    deleteDeviceAssignment(id: $id)
  }
`;

const GET_DEVICE_ASSIGNMENT = gql`
  query GET_DEVICE_ASSIGNMENT($deviceId: ID!) {
    getDeviceAssignmentByDeviceId(deviceId: $deviceId) {
      id
      deviceId
      name
      email
      location
    }
  }
`;

const Result = props => {
  const classes = useStyles();
  const selectedDeviceData = props.data.getDeviceById;
  const deviceId = selectedDeviceData.id;
  const createdAt = moment(selectedDeviceData.createdAt, 'x').format(
    'DD MMM YYYY hh:mm A'
  );
  const lastUpdatedAt = moment(selectedDeviceData.updatedAt, 'x').format(
    'DD MMM YYYY hh:mm A'
  );

  const [isAssignClicked, setAssignClicked] = useState(false);
  const [assignmentId, setAssignmentId] = useState('');
  const [name, setEmployeeName] = useState('');
  const [email, setEmployeeEmail] = useState('');
  const [location, setEmployeeLocation] = useState('');
  const [isEmployeeAssignmentExists, setEmployeeAssignmentExists] = useState(
    false
  );

  const [serialNumber, setSerialNumber] = useState(
    selectedDeviceData.serialNumber
  );
  const [description, setDescription] = useState(
    selectedDeviceData.description
  );
  const [vendor, setVendor] = useState(selectedDeviceData.vendor);
  const [model, setModel] = useState(selectedDeviceData.model);
  const [categoryId, setCategoryId] = useState(
    selectedDeviceData.deviceCategory.id
  );

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [confirmAssignDevice] = useMutation(ADD_DEVICE_ASSIGNMENT, {
    onCompleted: () => {
      setEmployeeAssignmentExists(true);
      handleClosed({
        confirmed: true,
        message: 'Successfully added device assignment!'
      });
    }
  });

  const handleClosed = args => {
    if (args != null && args.confirmed === true) {
      setMessage(args.message);
      setSnackBarOpen(true);
    }
    setAssignClicked(false);
  };

  const handleUnassigned = args => {
    setEmployeeName('');
    setEmployeeEmail('');
    setEmployeeLocation('');
    setEmployeeAssignmentExists(false);
  };

  // Get device categories
  const { loading, error, data } = useQuery(GET_DEVICE_CATEGORIES);

  // Get device assignments
  const {
    loading: getAssignmentLoading,
    error: getAssignmentError,
    data: getAssignmentData
  } = useQuery(GET_DEVICE_ASSIGNMENT, {
    variables: {
      deviceId
    },
    fetchPolicy: 'network-only',
    onCompleted: () => {
      if (getAssignmentData.getDeviceAssignmentByDeviceId.id != null) {
        setAssignmentId(getAssignmentData.getDeviceAssignmentByDeviceId.id);
        setEmployeeName(getAssignmentData.getDeviceAssignmentByDeviceId.name);
        setEmployeeEmail(getAssignmentData.getDeviceAssignmentByDeviceId.email);
        setEmployeeLocation(
          getAssignmentData.getDeviceAssignmentByDeviceId.location
        );
        setEmployeeAssignmentExists(true);
      }
    }
  });

  const [confirmDeleteDeviceAssignment] = useMutation(
    DELETE_DEVICE_ASSIGNMENT,
    {
      variables: {
        id: assignmentId
      },
      onCompleted: () => {
        setEmployeeAssignmentExists(false);
        handleClosed({
          confirmed: true,
          message: 'Successfully removed device assignment!'
        });
      }
    }
  );

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(</p>;

  if (getAssignmentLoading) return <CircularProgress />;
  if (getAssignmentError) return <p>Error :(</p>;

  return (
    <div>
      <GridList
        cellHeight={400}
        spacing={20}
        className={classes.gridList}
        cols={3}
      >
        <GridListTile>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">Basic Details</ListSubheader>
          </GridListTile>
          <Paper className={classes.paper}>
            <Card>
              <CardContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Serial Number"
                  defaultValue={serialNumber}
                  onChange={event => setSerialNumber(event.target.value)}
                  fullWidth
                />
                <TextField
                  autoFocus
                  margin="dense"
                  label="Description"
                  defaultValue={description}
                  onChange={event => setDescription(event.target.value)}
                  fullWidth
                />
                <TextField
                  autoFocus
                  margin="dense"
                  label="Model"
                  fullWidth
                  defaultValue={model}
                  onChange={event => setModel(event.target.value)}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  label="Vendor"
                  defaultValue={vendor}
                  onChange={event => setVendor(event.target.value)}
                  fullWidth
                />
                <FormControl className={classes.formControl}>
                  <Select
                    defaultValue={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    displayEmpty
                    className={classes.select}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="" disabled>
                      Category
                    </MenuItem>

                    {data.getDeviceCategories.deviceCategories.map(
                      (entry, i) => (
                        <MenuItem key={i} value={entry.id}>
                          {entry.name}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  <FormHelperText>Category</FormHelperText>
                </FormControl>
              </CardContent>
            </Card>
          </Paper>
        </GridListTile>

        <GridListTile>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">Date information</ListSubheader>
          </GridListTile>
          <Paper className={classes.paper}>
            <Card>
              <CardContent>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <KeyboardDatePicker
                      disableToolbar
                      variant="outlined"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline-1"
                      label="Purchsase date"
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                    <KeyboardDatePicker
                      margin="normal"
                      id="date-picker-dialog-1"
                      label="Warranty expiry date"
                      format="dd/MM/yyyy"
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <KeyboardDatePicker
                      disableToolbar
                      variant="outlined"
                      format="dd/MM/yyyy hh:mm a"
                      ampm="true"
                      margin="normal"
                      id="date-picker-inline-2"
                      label="Entry created at"
                      value={createdAt}
                      disabled
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                    <KeyboardDatePicker
                      margin="normal"
                      id="date-picker-dialog-2"
                      label="Entry last updated"
                      format="dd/MM/yyyy hh:mm a"
                      value={lastUpdatedAt}
                      disabled
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </CardContent>
            </Card>
          </Paper>
        </GridListTile>

        <GridListTile>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">Device Usage</ListSubheader>
          </GridListTile>
          <Paper className={classes.paper}>
            <Card>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  Current Status
                </Typography>

                {isEmployeeAssignmentExists ? (
                  <div>
                    <Typography
                      variant="h5"
                      component="h2"
                      className={classes.deviceStatus}
                      gutterBottom
                    >
                      ASSIGNED
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      color="textSecondary"
                    >
                      Name : {name}
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      color="textSecondary"
                    >
                      Email : {email}
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h2"
                      color="textSecondary"
                    >
                      Location : {location}
                    </Typography>
                  </div>
                ) : (
                  <Typography
                    variant="h5"
                    component="h2"
                    className={classes.deviceStatus}
                  >
                    AVAILABLE
                  </Typography>
                )}
              </CardContent>

              {isEmployeeAssignmentExists ? (
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => setAssignClicked(true)}
                  >
                    MODIFY
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={confirmDeleteDeviceAssignment}
                  >
                    UNASSIGN
                  </Button>
                </CardActions>
              ) : (
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => setAssignClicked(true)}
                  >
                    ASSIGN
                  </Button>
                </CardActions>
              )}
            </Card>
          </Paper>
        </GridListTile>
      </GridList>
      {isAssignClicked ? (
        <Dialog open={isAssignClicked} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Assign Device</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the details fo the employee
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              defaultValue={name}
              fullWidth
              onChange={event => setEmployeeName(event.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              type="email"
              label="Email"
              defaultValue={email}
              fullWidth
              onChange={event => setEmployeeEmail(event.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Location"
              fullWidth
              defaultValue={location}
              onChange={event => setEmployeeLocation(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosed} color="primary">
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => {
                confirmAssignDevice({
                  variables: {
                    input: {
                      deviceId,
                      name,
                      email,
                      location
                    }
                  }
                });
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
      <div className={classes.root}>
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackBarOpen(false)}
        >
          <Alert severity="success">{message}</Alert>
        </Snackbar>
      </div>
    </div>
  );
};

Result.propTypes = {
  className: PropTypes.string
};

export default Result;
