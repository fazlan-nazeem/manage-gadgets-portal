import React, { useState } from 'react';

import PropTypes from 'prop-types';

import {
  makeStyles,
  Card,
  Grid,
  CardContent,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Box
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
const UPDATE_DEVICE = gql`
  mutation UPDATE_DEVICE($input: DeviceInput!) {
    updateDevice(input: $input) {
      id
    }
  }
`;

const Result = props => {
  const classes = useStyles();
  const selectedDeviceData = props.data.getDeviceById;
  const deviceId = selectedDeviceData.id;
  console.log(selectedDeviceData);
  const createdAt = moment(selectedDeviceData.createdAt, 'x').format(
    'DD MMM YYYY hh:mm A'
  );
  const lastUpdatedAt = moment(selectedDeviceData.updatedAt, 'x').format(
    'DD MMM YYYY hh:mm A'
  );
  const [purchaseDate, setPurchaseDate] = useState(
    moment(selectedDeviceData.purchaseDate).format('DD/MM/YYYY')
  );
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState(
    moment(selectedDeviceData.warrantyExpiryDate).format('DD/MM/YYYY')
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
  // Get device categories
  const { loading, error, data } = useQuery(GET_DEVICE_CATEGORIES);

  const [updateDevice] = useMutation(UPDATE_DEVICE, {
    onCompleted: () => {
      handleClosed({
        confirmed: true,
        message: 'Successfully updated device!'
      });
    }
  });

  const handleClosed = args => {
    if (args != null && args.confirmed === true) {
      setMessage(args.message);
      setSnackBarOpen(true);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Grid item xs={12}>
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

                  {data.getDeviceCategories.deviceCategories.map((entry, i) => (
                    <MenuItem key={i} value={entry.id}>
                      {entry.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Category</FormHelperText>
              </FormControl>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container>
                  {' '}
                  <KeyboardDatePicker
                    variant="outlined"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline-1"
                    label="Purchsase date"
                    inputValue={purchaseDate}
                    onChange={value =>
                      setPurchaseDate(moment(value, 'x').format('DD/MM/YYYY'))
                    }
                    KeyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                  />
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog-1"
                    label="Warranty expiry date"
                    format="dd/MM/yyyy"
                    inputValue={warrantyExpiryDate}
                    onChange={value =>
                      setWarrantyExpiryDate(
                        moment(value, 'x').format('DD/MM/YYYY')
                      )
                    }
                    KeyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container>
                  <KeyboardDatePicker
                    format="dd/MM/yyyy hh:mm a"
                    margin="normal"
                    id="date-picker-inline-2"
                    label="Entry created at"
                    defaultValue={createdAt}
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
                    defaultValue={lastUpdatedAt}
                    disabled
                    KeyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>{' '}
              <Box display="flex" justifyContent="flex-end">
                <Button
                  color="primary"
                  className={classes.margin}
                  variant="contained"
                  size="large"
                  onClick={() => {
                    updateDevice({
                      variables: {
                        input: {
                          id: deviceId,
                          serialNumber,
                          description,
                          model,
                          vendor,
                          categoryId,
                          purchaseDate,
                          warrantyExpiryDate
                        }
                      }
                    });
                  }}
                >
                  Update Entry
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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
