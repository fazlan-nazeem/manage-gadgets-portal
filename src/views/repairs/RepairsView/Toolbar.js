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
import { Download as DownloadIcon } from 'react-feather';

import ExportRepairData from './ExportRepairData';

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

  const [isAddRepairOpen, handleAddRepairOpen] = useState(false);
  const handleAddRepairClosed = () => handleAddRepairOpen(false);

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
          <ExportRepairData
            isOpen={isExportOpen}
            handleClosed={handleExportClosed}
          />
        </Box>

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
