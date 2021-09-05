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
import { useMutation, useQuery, gql } from '@apollo/client';

const AssignmentInfo = props => {
  const isOpen = props.isAssignmentMode;
  let dataOfCurrentlySelectedRow = props.rowData;

  const [name, setEmployeeName] = useState('');
  const [email, setEmployeeEmail] = useState('');
  const [location, setEmployeeLocation] = useState('');
  const [id, setAssignmentId] = useState('');

  const deviceId = dataOfCurrentlySelectedRow.id;

  const ADD_DEVICE_ASSIGNMENT = gql`
    mutation ADD_DEVICE_ASSIGNMENT($input: DeviceAssignmentInput!) {
      addOrUpdateDeviceAssignment(input: $input) {
        deviceId
        name
        email
        location
      }
    }
  `;

  const DELETE_DEVICE_ASSIGNMENT = gql`
  mutation DELETE_DEVICE_ASSIGNMENT($id: ID!) {
    deleteDeviceAssignment(id: $id)
  }
  `;

  const GET_DEVICE_ASSIGNMENT = gql`
    query GET_DEVICE_ASSIGNMENT($deviceId: ID!) {
      getDeviceAssignmentByDeviceId(deviceId: $deviceId) {
        id
        deviceId
        name
        email
        location
      }
    }
  `;

const GET_DEVICES = gql`
query GET_DEVICES {
  getDevices {
    hasMore
    totalCount
    devices {
      id
      serialNumber
      model
      description
      vendor
      deviceStatus
      createdAt
      updatedAt
      warrantyExpiryDate
      purchaseDate
      deviceCategory {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
}
`;

  // Get device assignments
  const {
    loading: getAssignmentLoading,
    error: getAssignmentError,
    data: getAssignmentData
  } = useQuery(GET_DEVICE_ASSIGNMENT, {
    variables: {
      deviceId
    },
    fetchPolicy: 'network-only',
    onCompleted: () => {
      if (getAssignmentData.getDeviceAssignmentByDeviceId.id != null) {
        console.log('completed');
        setAssignmentId(getAssignmentData.getDeviceAssignmentByDeviceId.id);
        setEmployeeName(getAssignmentData.getDeviceAssignmentByDeviceId.name);
        setEmployeeEmail(getAssignmentData.getDeviceAssignmentByDeviceId.email);
        setEmployeeLocation(
          getAssignmentData.getDeviceAssignmentByDeviceId.location
        );
      }
    }
  });

  const [confirmAssignDevice] = useMutation(ADD_DEVICE_ASSIGNMENT, {
    onCompleted: () => {
      props.handleClosed({
        confirmed: true,
        message: 'Successfully added device assignment!'
      });
    }
  });

  const [confirmRemoveAssignment] = useMutation(DELETE_DEVICE_ASSIGNMENT, {
    onCompleted: () => {
      props.handleClosed({
        confirmed: true,
        message: 'Successfully removed device assignment!'
      });
    }
  });

  return (
    <div>
      <Dialog open={isOpen} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Assign Device</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter or update details of the employee
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            value={name}
            fullWidth
            onChange={event => setEmployeeName(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            type="email"
            label="Email"
            value={email}
            fullWidth
            onChange={event => setEmployeeEmail(event.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Location"
            fullWidth
            value={location}
            onChange={event => setEmployeeLocation(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClosed} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => {
              confirmAssignDevice({
                variables: {
                  input: {
                    deviceId,
                    name,
                    email,
                    location
                  }
                },
                refetchQueries: [{ query: GET_DEVICES }],
                awaitRefetchQueries: true
              });
            }}
          >
            Save
          </Button>
          <Button onClick={ ()=> {
            confirmRemoveAssignment( {
              variables : {
                id
              },
              refetchQueries: [{ query: GET_DEVICES }],
              awaitRefetchQueries: true
            });
          }}>
            Remove Assignment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssignmentInfo;
