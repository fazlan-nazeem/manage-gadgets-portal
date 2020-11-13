import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Box, makeStyles, IconButton, Tooltip } from '@material-ui/core';
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
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
