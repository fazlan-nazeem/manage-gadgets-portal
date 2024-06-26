import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { useMutation, gql } from '@apollo/client';

const DELETE_REPAIR = gql`
  mutation DeleteRepair($id: ID!) {
    deleteRepair(id: $id)
  }
`;

const DeleteRepair = props => {
  const isOpen = props.isOpen;
  let dataOfCurrentlySelectedRow = props.rowData;
  const id = dataOfCurrentlySelectedRow.id;
  const GET_REPAIRS = props.getRepairsQuery;
  const [confirmDeleteRepair] = useMutation(DELETE_REPAIR, {
    onCompleted: () => {
      props.handleClosed({
        confirmed: true,
        message: 'Successfully deleted repair entry!'
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
              confirmDeleteRepair({
                variables: {
                  id
                },
                refetchQueries: [{ query: GET_REPAIRS }],
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

export default DeleteRepair;
