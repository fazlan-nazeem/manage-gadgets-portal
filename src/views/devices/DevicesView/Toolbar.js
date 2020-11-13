import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  makeStyles,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { Upload as UploadIcon } from 'react-feather';
import { Download as DownloadIcon } from 'react-feather';
import AddDevice from './AddDevice';
import ExportDeviceData from './ExportDeviceData';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();

  const [isAddDeviceOpen, handleAddDeviceOpen] = useState(false);
  const [isExportOpen, handlExportOpen] = useState(false);
  const handleExportClosed = () => handlExportOpen(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleDialogClosed = args => {
    handleAddDeviceOpen(false);
    if (args != null && args.confirmed === true) {
      setMessage(args.message);
      setSnackBarOpen(true);
    }
  };

  return (
    <div>
      <div className={clsx(classes.root, className)} {...rest}>
        <Box display="flex" justifyContent="flex-end">
          <input
            accept="image/*"
            className={classes.input}
            id="icon-button-file"
            type="file"
            hidden
          />
          <Tooltip title="Upload Data">
            <label htmlFor="icon-button-file">
              <IconButton
                color="primary"
                className={classes.button}
                component="span"
              >
                <UploadIcon />
              </IconButton>
            </label>
          </Tooltip>
          <Tooltip title="Download Data">
            <label>
              <IconButton
                color="primary"
                className={classes.button}
                component="span"
                onClick={() => handlExportOpen(true)}
              >
                <DownloadIcon />
              </IconButton>
            </label>
          </Tooltip>
          <ExportDeviceData
            isOpen={isExportOpen}
            handleClosed={handleExportClosed}
          />
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleAddDeviceOpen(true)}
          >
            Add Device
          </Button>
        </Box>
        <AddDevice isOpen={isAddDeviceOpen} handleClosed={handleDialogClosed} />

        <div className={classes.root}>
          <Snackbar
            open={snackBarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackBarOpen(false)}
          >
            <Alert severity="success">{message}</Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
