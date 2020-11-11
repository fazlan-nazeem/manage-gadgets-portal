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

const EditDevice = props => {
  const classes = useStyles();
  const isOpen = props.isEditMode;
  let dataOfEditedRow = props.rowData;

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
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            defaultValue={dataOfEditedRow.description}
            fullWidth
          />
          <FormControl className={classes.formControl}>
            <InputLabel>Category</InputLabel>
            <Select defaultValue={dataOfEditedRow.category}>
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
          />
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            defaultValue={dataOfEditedRow.employee.email}
          />
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

export default EditDevice;
