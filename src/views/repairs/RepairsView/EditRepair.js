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
        category
        description
        employee {
          email
          name
        }
      }
      createdDate
      status
      repairDescription
    }
  }
`;

const GET_REPAIRS = gql`
  query GetRepairs {
    getRepairs {
      hasMore
      repairs {
        id
        status
        createdDate
        repairDescription
        device {
          id
          serialNumber
          category
          description
          employee {
            name
            email
          }
        }
      }
    }
  }
`;

const EditRepair = props => {
  const classes = useStyles();
  const isOpen = props.isEditMode;
  let dataOfEditedRow = props.rowData;
  const repairUuid = dataOfEditedRow.id;

  const [repairDescription, setRepairDescription] = useState(
    dataOfEditedRow.repairDescription
  );
  const [repairStatus, setRepairStatus] = useState(dataOfEditedRow.status);

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
            label="Description"
            fullWidth
            defaultValue={dataOfEditedRow.device.description}
            disabled
          />
          <FormControl className={classes.formControl}>
            <InputLabel>Category</InputLabel>
            <Select defaultValue={dataOfEditedRow.device.category} disabled>
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
            onChange={e => setRepairDescription(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Employee name"
            fullWidth
            defaultValue={dataOfEditedRow.device.employee.name}
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            defaultValue={dataOfEditedRow.device.employee.email}
            disabled
          />

          <FormControl className={classes.formControl}>
            <InputLabel>Status</InputLabel>
            <Select
              defaultValue={dataOfEditedRow.status}
              onChange={e => setRepairStatus(e.target.value)}
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
                    repairUuid,
                    repairDescription,
                    repairStatus
                  }
                },
                refetchQueries: [{ query: GET_REPAIRS }]
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
