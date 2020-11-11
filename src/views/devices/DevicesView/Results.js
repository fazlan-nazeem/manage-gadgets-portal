import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
  IconButton,
  Tooltip
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import BugReportIcon from '@material-ui/icons/BugReport';
import EditDevice from './EditDevice';
import DeleteDevice from './DeleteDevice';
import RepairDevice from './RepairDevice';
import { useQuery, gql } from '@apollo/client';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, devices, ...rest }) => {
  const classes = useStyles();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [isEditMode, setEditMode] = useState(false);
  const [isDeleteMode, setDeleteMode] = useState(false);
  const [isRepairMode, setRepairMode] = useState(false);
  const [rowData, setRowData] = useState({
    serialNumber: '',
    description: '',
    employee: { name: '', email: '' },
    category: ''
  });

  const GET_DEVICES = gql`
    query GET_DEVICES {
      getDevices(pageSize: 20) {
        devices {
          id
          serialNumber
          description
          category
          employee {
            name
            email
            assignedTime
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_DEVICES, {});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleLimitChange = event => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeviceEdit = i => {
    setEditMode(true);
    const dataOfEditedRow = data.getDevices.devices.slice(0, limit)[i];
    setRowData(dataOfEditedRow);
  };

  const handleDeviceRepair = i => {
    setRepairMode(true);
    const dataOfEditedRow = data.getDevices.devices.slice(0, limit)[i];
    setRowData(dataOfEditedRow);
  };

  const handleDeviceDelete = event => {
    setDeleteMode(true);
  };

  const handleEditClosed = () => setEditMode(false);
  const handleDeviceClosed = () => setDeleteMode(false);
  const handleRepairClosed = () => setRepairMode(false);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial Number</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Assigned Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.getDevices.devices.slice(0, limit).map((entry, i) => (
                <TableRow key={i}>
                  <TableCell>{entry.serialNumber}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>{entry.employee.name}</TableCell>
                  <TableCell>{entry.employee.email}</TableCell>

                  <TableCell>
                    {moment(entry.employee.assignedTime, 'x').format(
                      'DD MMM YYYY hh:mm A'
                    )}
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Tooltip title="Edit entry">
                      <IconButton
                        aria-label="edit"
                        onClick={e => handleDeviceEdit(i)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Tooltip title="Add to repair">
                      <IconButton
                        aria-label="repair"
                        onClick={e => handleDeviceRepair(i)}
                      >
                        <BugReportIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Tooltip title="Delete entry">
                      <IconButton
                        aria-label="delete"
                        onClick={handleDeviceDelete}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <EditDevice
          isEditMode={isEditMode}
          handleClosed={handleEditClosed}
          rowData={rowData}
        />
        <RepairDevice
          isOpen={isRepairMode}
          handleClosed={handleRepairClosed}
          rowData={rowData}
        />
        <DeleteDevice isOpen={isDeleteMode} handleClosed={handleDeviceClosed} />
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.getDevices.devices.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string
};

export default Results;
