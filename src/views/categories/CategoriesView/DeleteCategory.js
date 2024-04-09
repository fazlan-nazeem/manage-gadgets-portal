import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { useMutation, gql } from '@apollo/client';

const DELETE_DEVICE_CATEGORY = gql`
  mutation DeleteDeviceCategory($id: ID!) {
    deleteDeviceCategory(id: $id)
  }
`;

const DeleteDeviceCategory = props => {
  const isOpen = props.isOpen;
  let dataOfCurrentlySelectedRow = props.rowData;
  const id = dataOfCurrentlySelectedRow.id;
  const GET_DEVICE_CATEGORIES = props.getDeviceCategoriesQuery;

  const [limit] = useState(10);
  const [page] = useState(0);
  const [keyword] = useState('');

  const [confirmDeleteCategory] = useMutation(DELETE_DEVICE_CATEGORY, {
    onCompleted: () => {
      props.handleClosed({
        confirmed: true,
        message: 'Successfully deleted category!'
      });
    }
  });

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={props.handleClosed}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Delete Repair Entry?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete this repair entry?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={e => {
              confirmDeleteCategory({
                variables: {
                  id
                },
                refetchQueries: [
                  { query: GET_DEVICE_CATEGORIES,
                    variables: { 
                      pageSize: limit,
                      after: (page * limit).toString(),
                      keyword: keyword,
                    }
                  }
                ],
                awaitRefetchQueries: true
              });
            }}
            color="primary"
          >
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

export default DeleteDeviceCategory;
