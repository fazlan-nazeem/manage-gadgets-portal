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
  }
}));

const UPDATE_REPAIR = gql`
  mutation UPDATE_REPAIR($input: RepairInput) {
    updateRepair(input: $input) {
      id
      device {
        serialNumber
        model
        description
        deviceCategory {
          name
        }
      }
      createdAt
      status
      description
      agent
    }
  }
`;

const EditRepair = props => {
  const classes = useStyles();
  const isOpen = props.isEditMode;
  let dataOfEditedRow = props.rowData;
  const id = dataOfEditedRow.id;

  const [description, setDescription] = useState(dataOfEditedRow.description);
  const [status, setStatus] = useState(dataOfEditedRow.status);
  const [agent, setAgent] = useState(dataOfEditedRow.agent);

  const [confirmUpdateRepair] = useMutation(UPDATE_REPAIR);

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
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            label="Model"
            fullWidth
            defaultValue={dataOfEditedRow.device.model}
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            label="Category"
            fullWidth
            defaultValue={dataOfEditedRow.device.deviceCategory.name}
            disabled
          />

          <TextField
            autoFocus
            margin="dense"
            label="Remarks"
            fullWidth
            defaultValue={dataOfEditedRow.description}
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Agent"
            fullWidth
            defaultValue={dataOfEditedRow.agent}
            onChange={e => setAgent(e.target.value)}
          />

          <FormControl className={classes.formControl}>
            <InputLabel>Status</InputLabel>
            <Select
              defaultValue={dataOfEditedRow.status}
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value={'PENDING'}>PENDING</MenuItem>
              <MenuItem value={'IN_PROGRESS'}>IN_PROGRESS</MenuItem>
              <MenuItem value={'COMPLETED'}>COMPLETED</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClosed} color="primary">
            Cancel
          </Button>
          <Button
            onClick={e => {
              confirmUpdateRepair({
                variables: {
                  input: {
                    id,
                    status,
                    description,
                    agent
                  }
                }
              });
              props.handleClosed({
                confirmed: true,
                message: 'Successfully updated repair entry!'
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

export default EditRepair;
