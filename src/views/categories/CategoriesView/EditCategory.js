import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, gql } from '@apollo/client';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const UPDATE_DEVICE_CATEGORY = gql`
  mutation UPDATE_DEVICE_CATEGORY($id: ID!, $name: String!) {
    updateDeviceCategory(id: $id, name: $name) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const EditCategory = props => {
  const classes = useStyles();
  const isOpen = props.isEditMode;
  let dataOfEditedRow = props.rowData;
  const id = dataOfEditedRow.id;
  const [name, setName] = useState(dataOfEditedRow.name);
  const [confirmUpdateDeviceCategory] = useMutation(UPDATE_DEVICE_CATEGORY);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={props.handleClosed}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Category Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Rename the category</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            defaultValue={dataOfEditedRow.name}
            onChange={e => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClosed} color="primary">
            Cancel
          </Button>
          <Button
            onClick={e => {
              confirmUpdateDeviceCategory({
                variables: {
                  id,
                  name
                }
              });
              props.handleClosed({
                confirmed: true,
                message: 'Successfully renamed category!'
              });
            }}
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditCategory;
