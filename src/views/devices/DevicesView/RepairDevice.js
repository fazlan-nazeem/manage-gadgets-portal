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
import { useMutation, gql } from '@apollo/client';

const REPAIR_DEVICE = gql`
  mutation REPAIR_DEVICE($input: RepairInput) {
    addRepair(input: $input) {
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

const RepairDevice = props => {
  const isOpen = props.isRepairMode;
  let dataOfCurrentlySelectedRow = props.rowData;
  const [repairDescription, setRepairDescription] = useState('');
  const deviceUuid = dataOfCurrentlySelectedRow.id;

  const [confirmAddToRepair] = useMutation(REPAIR_DEVICE);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={props.handleClosed}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add to Repair</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the issue desciption and add to repair
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="5"
            label="Serial Number"
            fullWidth
            defaultValue={dataOfCurrentlySelectedRow.serialNumber}
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            defaultValue={dataOfCurrentlySelectedRow.description}
            disabled
          />
          <FormControl disabled>
            <InputLabel>Category</InputLabel>
            <Select defaultValue={dataOfCurrentlySelectedRow.category}>
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
            defaultValue={dataOfCurrentlySelectedRow.employee.name}
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            defaultValue={dataOfCurrentlySelectedRow.employee.email}
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            label="Remarks"
            fullWidth
            placeholder="Describe the issue"
            onChange={e => setRepairDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClosed} color="primary">
            Cancel
          </Button>
          <Button
            onClick={e => {
              confirmAddToRepair({
                variables: {
                  input: {
                    repairDescription,
                    deviceUuid
                  }
                },
                refetchQueries: [{ query: GET_REPAIRS }]
              });
              props.handleClosed({
                confirmed: true,
                message: 'Successfully added device to repair!'
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

export default RepairDevice;
