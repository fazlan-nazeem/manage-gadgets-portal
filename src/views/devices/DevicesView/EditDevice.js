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

const UPDATE_DEVICE = gql`
  mutation UPDATE_DEVICE($input: DeviceInput) {
    updateDevice(input: $input) {
      id
      serialNumber
      category
      description
      employee {
        email
        name
        assignedTime
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

const EditDevice = props => {
  const classes = useStyles();
  const isOpen = props.isEditMode;
  let dataOfEditedRow = props.rowData;
  const deviceUuid = dataOfEditedRow.id;
  const [confirmUpdateDevice] = useMutation(UPDATE_DEVICE);

  const [serialNumber, setSerialNumber] = useState(
    dataOfEditedRow.serialNumber
  );
  const [description, setDescription] = useState(dataOfEditedRow.description);
  const [category, setCategory] = useState(dataOfEditedRow.category);
  const [employeeName, setEmployeeName] = useState(
    dataOfEditedRow.employee.name
  );
  const [employeeEmail, setEmployeeEmail] = useState(
    dataOfEditedRow.employee.email
  );

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={props.handleClosed}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Device Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the relevant details about the device and the current owner
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            label="Serial Number"
            defaultValue={dataOfEditedRow.serialNumber}
            fullWidth
            onChange={e => setSerialNumber(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            defaultValue={dataOfEditedRow.description}
            fullWidth
            onChange={e => setDescription(e.target.value)}
          />
          <FormControl className={classes.formControl}>
            <InputLabel>Category</InputLabel>
            <Select
              defaultValue={dataOfEditedRow.category}
              onChange={e => setCategory(e.target.value)}
            >
              <MenuItem value={'LAPTOP'}>LAPTOP</MenuItem>
              <MenuItem value={'MONITOR'}>MONITOR</MenuItem>
              <MenuItem value={'MOBILE'}>MOBILE</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Employee name"
            fullWidth
            defaultValue={dataOfEditedRow.employee.name}
            onChange={e => setEmployeeName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            defaultValue={dataOfEditedRow.employee.email}
            onChange={e => setEmployeeEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClosed} color="primary">
            Cancel
          </Button>
          <Button
            onClick={e => {
              confirmUpdateDevice({
                variables: {
                  input: {
                    deviceUuid,
                    serialNumber,
                    description,
                    category,
                    employeeName,
                    employeeEmail
                  }
                },
                refetchQueries: [{ query: GET_DEVICES }]
              });

              props.handleClosed({
                confirmed: true,
                message: 'Successfully updated device entry!'
              });
            }}
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditDevice;
