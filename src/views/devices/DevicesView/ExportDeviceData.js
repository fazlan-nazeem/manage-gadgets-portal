import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';

const ExportDeviceData = props => {
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
          {'Export Repair Data?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to download all device data as a CSV?
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

export default ExportDeviceData;
