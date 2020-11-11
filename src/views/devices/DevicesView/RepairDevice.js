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
import { useMutation, gql } from '@apollo/client';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
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

const REPAIR_DEVICE = gql`
  mutation REPAIR_DEVICE($input: RepairInput) {
    addRepair(input: $input) {
      id
      device {
        serialNumber
        category
        description
        employee {
          email
          name
        }
      }
      createdDate
      status
      repairDescription
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

const RepairDevice = props => {
  const classes = useStyles();
  const isOpen = props.isOpen;
  let dataOfCurrentlySelectedRow = props.rowData;
  const [repairDescription, setRepairDescription] = useState('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const deviceUuid = dataOfCurrentlySelectedRow.id;

  const [confirmAddToRepair, { data }] = useMutation(REPAIR_DEVICE);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={props.handleClosed}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add to Repair</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the issue desciption and add to repair
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="5"
            label="Serial Number"
            fullWidth
            defaultValue={dataOfCurrentlySelectedRow.serialNumber}
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            defaultValue={dataOfCurrentlySelectedRow.description}
            disabled
          />
          <FormControl disabled>
            <InputLabel>Category</InputLabel>
            <Select defaultValue={dataOfCurrentlySelectedRow.category}>
              <MenuItem value={'LAPTOP'}>LAPTOP</MenuItem>
              <MenuItem value={'MONITOR'}>MONITOR</MenuItem>
              <MenuItem value={'MOBILE'}>MOBILE</MenuItem>
            </Select>
          </FormControl>

          <TextField
            autoFocus
            margin="dense"
            label="Employee name"
            fullWidth
            defaultValue={dataOfCurrentlySelectedRow.employee.name}
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            defaultValue={dataOfCurrentlySelectedRow.employee.email}
            disabled
          />
          <TextField
            autoFocus
            margin="dense"
            label="Remarks"
            fullWidth
            placeholder="Describe the issue"
            onChange={e => setRepairDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClosed} color="primary">
            Cancel
          </Button>
          <Button
            onClick={e => {
              confirmAddToRepair({
                variables: {
                  input: {
                    repairDescription,
                    deviceUuid
                  }
                },
                refetchQueries: [{ query: GET_REPAIRS }]
              });
              setSnackBarOpen(true);
              props.handleClosed();
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <div className={classes.root}>
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackBarOpen(false)}
        >
          <Alert severity="success">Device successfuly added to repair!</Alert>
        </Snackbar>
      </div>
      ;
    </div>
  );
};

export default RepairDevice;
