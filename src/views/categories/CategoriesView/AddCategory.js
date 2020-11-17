import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery, gql } from '@apollo/client';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const ADD_CATEGORY = gql`
  mutation ADD_CATEGORY($name: String!) {
    addDeviceCategory(name: $name) {
      id
      name
      createdAt
    }
  }
`;

const GET_DEVICE_CATEGORIES = gql`
  query GET_DEVICE_CATEGORIES {
    getDeviceCategories {
      hasMore
      totalCount
      deviceCategories {
        id
        name
        createdAt
      }
    }
  }
`;

const AddCategory = props => {
  const classes = useStyles();
  const isOpen = props.isOpen;

  const [confirmAddCategory] = useMutation(ADD_CATEGORY, {
    onCompleted: () => {
      props.handleClosed({
        confirmed: true,
        message: 'Successfully added device entry!'
      });
    }
  });
  const [name, setName] = useState('');

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={props.handleClosed}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Category</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the name of the category</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            onChange={e => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClosed} color="primary">
            Cancel
          </Button>
          <Button
            onClick={e => {
              confirmAddCategory({
                variables: {
                  name
                },
                refetchQueries: [{ query: GET_DEVICE_CATEGORIES }],
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

export default AddCategory;
