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
  mutation deleteDevice($deviceId: ID!) {
    deleteDevice(id: $deviceId)
  }
`;

const DeleteDevice = props => {
  const isOpen = props.isDeleteMode;
  const GET_DEVICES = props.getDevicesQuery;
  const [confirmDeleteDevice] = useMutation(DELETE_DEVICE, {
    onCompleted: () => {
      props.handleClosed({
        confirmed: true,
        message: 'Successfully deleted device entry!'
      });
    }
  });

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
