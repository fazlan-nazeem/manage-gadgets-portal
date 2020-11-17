import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@material-ui/core';
import { useMutation, gql } from '@apollo/client';

const REPAIR_DEVICE = gql`
  mutation REPAIR_DEVICE($input: RepairInput) {
    addRepair(input: $input) {
      description
      status
      agent
    }
  }
`;

const GET_REPAIRS = gql`
  query GET_REPAIRS {
    getRepairs {
      hasMore
      totalCount
      repairs {
        id
        status
        description
        agent
        createdAt
        device {
          id
          serialNumber
          model
          description
          deviceCategory {
            name
          }
        }
      }
    }
  }
`;

const RepairDevice = props => {
  const isOpen = props.isRepairMode;
  let dataOfCurrentlySelectedRow = props.rowData;
  const [description, setDescription] = useState('');
  const [agent, setAgent] = useState('');
  const deviceId = dataOfCurrentlySelectedRow.id;

  const [confirmAddToRepair, { loading, error, called, data }] = useMutation(
    REPAIR_DEVICE
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  if (!error && data) {
    return null;
  }

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
            label="Serial Number"
            fullWidth
            defaultValue={dataOfCurrentlySelectedRow.serialNumber}
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            label="Category"
            fullWidth
            defaultValue={dataOfCurrentlySelectedRow.description}
            disabled
          />

          <TextField
            autoFocus
            margin="dense"
            label="Model"
            fullWidth
            defaultValue={dataOfCurrentlySelectedRow.model}
            disabled
          />

          <TextField
            autoFocus
            margin="dense"
            label="Remarks"
            fullWidth
            placeholder="Describe the issue"
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Agent"
            fullWidth
            placeholder="Specify the repair agent"
            onChange={e => setAgent(e.target.value)}
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
                    deviceId,
                    description,
                    agent
                  }
                },
                refetchQueries: [{ query: GET_REPAIRS }],
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

export default RepairDevice;
