import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { Upload as UploadIcon } from 'react-feather';
import { Download as DownloadIcon } from 'react-feather';
import AddDevice from './AddDevice';
import ExportDeviceData from './ExportDeviceData';

const useStyles = makeStyles(theme => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();

  const [isAddDeviceOpen, handleAddDeviceOpen] = useState(false);
  const handleAddDeviceClosed = () => handleAddDeviceOpen(false);

  const [isExportOpen, handlExportOpen] = useState(false);
  const handleExportClosed = () => handlExportOpen(false);

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
        <AddDevice
          isOpen={isAddDeviceOpen}
          handleClosed={handleAddDeviceClosed}
        />

        <Box mt={3}>
          <Card>
            <CardContent>
              <Box maxWidth={500}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    )
                  }}
                  placeholder="Search"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
