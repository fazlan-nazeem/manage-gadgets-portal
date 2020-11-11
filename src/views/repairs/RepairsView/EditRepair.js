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

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const EditRepair = props => {
  const classes = useStyles();
  const isOpen = props.isEditMode;
  let dataOfEditedRow = props.rowData;

  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={props.handleClosed}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Repair Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the relevant details about the device and the current owner
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Serial Number"
            fullWidth
            defaultValue={dataOfEditedRow.device.serialNumber}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            defaultValue={dataOfEditedRow.device.description}
          />
          <FormControl className={classes.formControl}>
            <InputLabel>Category</InputLabel>
            <Select defaultValue={dataOfEditedRow.device.category}>
              <MenuItem value={'LAPTOP'}>LAPTOP</MenuItem>
              <MenuItem value={'MONITOR'}>MONITOR</MenuItem>
              <MenuItem value={'MOBILE'}>MOBILE</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Remarks"
            fullWidth
            defaultValue={dataOfEditedRow.repairDescription}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Employee name"
            fullWidth
            defaultValue={dataOfEditedRow.device.employee.name}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            defaultValue={dataOfEditedRow.device.employee.email}
          />

          <FormControl className={classes.formControl}>
            <InputLabel>Status</InputLabel>
            <Select defaultValue={dataOfEditedRow.status}>
              <MenuItem value={'PENDING'}>PENDING</MenuItem>
              <MenuItem value={'IN_PROGRESS'}>IN_PROGRESS</MenuItem>
              <MenuItem value={'COMPLETE'}>COMPLETE</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClosed} color="primary">
            Cancel
          </Button>
          <Button onClick={props.handleClosed} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditRepair;
