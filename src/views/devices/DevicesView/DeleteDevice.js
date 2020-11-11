import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';

const DeleteDevice = props => {
  const isOpen = props.isOpen;

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
          <Button onClick={props.handleClosed} color="primary">
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
