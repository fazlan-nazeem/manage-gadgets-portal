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
  InputLabel,
  FormControl,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, gql } from '@apollo/client';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ADD_DEVICE = gql`
  mutation ADD_DEVICE($input: DeviceInput) {
    addDevice(input: $input) {
      serialNumber
      description
      category
      employee {
        name
        email
      }
    }
  }
`;

const GET_DEVICES = gql`
  query GET_DEVICES {
    getDevices(pageSize: 20) {
      devices {
        id
        serialNumber
        description
        category
        employee {
          name
          email
          assignedTime
        }
      }
    }
  }
`;

const AddDevice = props => {
  const classes = useStyles();
  const isOpen = props.isOpen;

  const [confirmAddDevice, { data }] = useMutation(ADD_DEVICE);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');

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
            id="5"
            label="Serial Number"
            fullWidth
            onChange={e => setSerialNumber(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="4"
            label="Description"
            fullWidth
            onChange={e => setDescription(e.target.value)}
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="3"
              value={category}
              onChange={event => setCategory(event.target.value)}
            >
              <MenuItem value={'LAPTOP'}>LAPTOP</MenuItem>
              <MenuItem value={'MONITOR'}>MONITOR</MenuItem>
              <MenuItem value={'MOBILE'}>MOBILE</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="1"
            label="Employee name"
            fullWidth
            onChange={e => setEmployeeName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="2"
            label="Email Address"
            type="email"
            fullWidth
            onChange={e => setEmployeeEmail(e.target.value)}
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
                    description,
                    category,
                    employeeName,
                    employeeEmail
                  }
                },
                refetchQueries: [{ query: GET_DEVICES }]
              });
              setSnackBarOpen(true);
              props.handleClosed();
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <div className={classes.root}>
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackBarOpen(false)}
        >
          <Alert severity="success">Device successfuly added to repair!</Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AddDevice;
