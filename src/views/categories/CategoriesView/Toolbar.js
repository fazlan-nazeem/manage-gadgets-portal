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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AddCategory from './AddCategory';

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

  const [isAddCategoryOpen, handleAddCategoryOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleDialogClosed = args => {
    handleAddCategoryOpen(false);
    if (args != null && args.confirmed === true) {
      setMessage(args.message);
      setSnackBarOpen(true);
    }
  };

  return (
    <div>
      <div className={clsx(classes.root, className)} {...rest}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            color="primary"
            className={classes.margin}
            variant="contained"
            size="large"
            onClick={() => handleAddCategoryOpen(true)}
          >
            Add Category
          </Button>
        </Box>
      </div>
      <AddCategory
        isOpen={isAddCategoryOpen}
        handleClosed={handleDialogClosed}
      />

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
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
