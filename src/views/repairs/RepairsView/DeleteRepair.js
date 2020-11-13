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
  mutation DeleteRepair($repairId: ID!) {
    deleteRepair(repairId: $repairId) {
      id
    }
  }
`;

const GET_REPAIRS = gql`
  query GetRepairs {
    getRepairs {
      hasMore
      repairs {
        id
        status
        createdDate
        repairDescription
        device {
          id
          serialNumber
          category
          description
          employee {
            name
            email
          }
        }
      }
    }
  }
`;

const DeleteRepair = props => {
  const isOpen = props.isOpen;
  let dataOfCurrentlySelectedRow = props.rowData;
  const repairId = dataOfCurrentlySelectedRow.id;

  const [confirmDeleteRepair] = useMutation(DELETE_REPAIR);

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
                  repairId
                },
                refetchQueries: [{ query: GET_REPAIRS }]
              });
              props.handleClosed({
                confirmed: true,
                message: 'Successfully deleted repair entry!'
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
