import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { useMutation, gql } from '@apollo/client';

const DELETE_DEVICE = gql`
  mutation DeleteDevice($deviceId: ID!) {
    deleteDevice(deviceId: $deviceId) {
      id
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

const DeleteDevice = props => {
  const isOpen = props.isDeleteMode;
  const [confirmDeleteDevice] = useMutation(DELETE_DEVICE);
  let dataOfCurrentlySelectedRow = props.rowData;
  const deviceId = dataOfCurrentlySelectedRow.id;

  const handleDeleteConfirmation = () => {
    confirmDeleteDevice({
      variables: {
        deviceId
      },
      refetchQueries: [{ query: GET_DEVICES }],
      awaitRefetchQueries: true
    });
    props.handleClosed({
      confirmed: true,
      message: 'Successfully deleted device entry!'
    });
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={props.handleClosed}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Delete Device Entry?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete this device entry?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmation} color="primary">
            Yes
          </Button>
          <Button onClick={props.handleClosed} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteDevice;
