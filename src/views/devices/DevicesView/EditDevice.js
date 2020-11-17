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
  MenuItem,
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery, gql } from '@apollo/client';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(4)
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
      deviceCategory {
        id
        name
      }
      serialNumber
      description
      deviceStatus
      vendor
      createdAt
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

const EditDevice = props => {
  const classes = useStyles();
  const isOpen = props.isEditMode;
  let dataOfEditedRow = props.rowData;
  const id = dataOfEditedRow.id;
  const { loading, error, data } = useQuery(GET_DEVICE_CATEGORIES);
  const [confirmUpdateDevice] = useMutation(UPDATE_DEVICE);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [serialNumber, setSerialNumber] = useState(
    dataOfEditedRow.serialNumber
  );
  const [description, setDescription] = useState(dataOfEditedRow.description);
  const [model, setModel] = useState(dataOfEditedRow.model);
  const [vendor, setVendor] = useState(dataOfEditedRow.vendor);
  const [categoryId, setCategoryId] = useState(
    dataOfEditedRow.deviceCategory.id
  );

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      {console.log(data)}
      <Dialog
        open={isOpen}
        onClose={props.handleClosed}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Device Details</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>Device information</DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            label="Serial Number"
            defaultValue={dataOfEditedRow.serialNumber}
            fullWidth
            onChange={e => setSerialNumber(e.target.value)}
            variant="outlined"
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            defaultValue={dataOfEditedRow.description}
            fullWidth
            onChange={e => setDescription(e.target.value)}
            variant="outlined"
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel margin="dense">Category</InputLabel>
            <Select
              defaultValue={dataOfEditedRow.deviceCategory.id}
              onChange={e => setCategoryId(e.target.value)}
            >
              {data.getDeviceCategories.deviceCategories.map((entry, i) => (
                <MenuItem key={i} value={entry.id}>
                  {entry.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Model"
            fullWidth
            defaultValue={dataOfEditedRow.model}
            onChange={e => setModel(e.target.value)}
            variant="outlined"
          />
          <TextField
            autoFocus
            margin="dense"
            label="Vendor"
            fullWidth
            defaultValue={dataOfEditedRow.vendor}
            onChange={e => setVendor(e.target.value)}
            variant="outlined"
          />
        </DialogContent>

        <DialogContent dividers>
          <DialogContentText>Date information</DialogContentText>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                disableToolbar
                variant="outlined"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Purchase date"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Warranty expiry date"
                format="dd/MM/yyyy"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogContent dividers>
          <DialogContentText>Device usage information</DialogContentText>
          <Grid container justify="space-around">
            <TextField
              autoFocus
              margin="normal"
              label="Current owner name"
              defaultValue="Fazlan Nazeem"
              variant="outlined"
            />
            <TextField
              autoFocus
              type="email"
              margin="normal"
              label="Current owner email"
              defaultValue="fazlann@wso2.com"
              variant="outlined"
            />
          </Grid>
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
                    id,
                    categoryId,
                    serialNumber,
                    description,
                    model,
                    vendor
                  }
                }
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
