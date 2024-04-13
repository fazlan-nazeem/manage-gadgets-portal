import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  FormHelperText,
  FormControl,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery, gql } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  select: {
    marginTop: theme.spacing(1)
  }
}));

const ADD_DEVICE = gql`
  mutation ADD_DEVICE($input: DeviceInput) {
    addDevice(input: $input) {
      serialNumber
      model
      description
      vendor
    }
  }
`;

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

const GET_DEVICES = gql`
  query GET_DEVICES($pageSize: Int, $after: String, $keyword: String, $deviceStatus: String) {
    getDevices(pageSize: $pageSize, after: $after, keyword: $keyword, deviceStatus: $deviceStatus) {
      hasMore
      totalCount
      devices {
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
  }
`;

const AddDevice = props => {
  const classes = useStyles();
  const isOpen = props.isOpen;

  const [page, setPage] = useState(0);
  const [keyword, setkeyword] = useState('');
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('ALL');

  const { loading, error, data } = useQuery(GET_DEVICE_CATEGORIES);
  const [confirmAddDevice] = useMutation(ADD_DEVICE, {
    onCompleted: () => {
      props.handleClosed({
        confirmed: true,
        message: 'Successfully added device entry!'
      });
    }
  });

  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [model, setModel] = useState('');

  const [vendor, setVendor] = useState('');
  const [categoryId, setCategoryId] = useState('');

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={props.handleClosed}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Device</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the relevant details about the device and the current owner
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Serial Number"
            fullWidth
            onChange={e => setSerialNumber(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Model"
            fullWidth
            onChange={e => setModel(e.target.value)}
          />
          <FormControl className={classes.formControl}>
            <Select
              onChange={e => setCategoryId(e.target.value)}
              inputProps={{ 'aria-label': 'Without label' }}
              displayEmpty
              className={classes.select}
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
          <TextField
            autoFocus
            margin="dense"
            label="Vendor"
            fullWidth
            onChange={e => setVendor(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClosed} color="primary">
            Cancel
          </Button>
          <Button
            onClick={e => {
              confirmAddDevice({
                variables: {
                  input: {
                    serialNumber,
                    categoryId,
                    model,
                    description,
                    vendor
                  }
                },
                refetchQueries: [
                  { query: GET_DEVICES,
                    variables: { 
                      pageSize: limit,
                      after: (page * limit).toString(),
                      keyword: keyword,
                      deviceStatus: status
                    }
                  }
                ],
                awaitRefetchQueries: true
              });
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddDevice;
