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
  Typography,
  makeStyles,
  IconButton,
  Button
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EditRepair from './EditRepair';
import DeleteRepair from './DeleteRepair';
import { useQuery, gql } from '@apollo/client';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, ...rest }) => {
  const classes = useStyles();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [isEditMode, setEditMode] = useState(false);
  const [isDeleteMode, setDeleteMode] = useState(false);
  const [rowData, setRowData] = useState({
    device: {
      serialNumber: '',
      description: '',
      category: '',
      remarks: '',
      employee: { name: '', email: '' }
    },
    status: '',
    repairDescription: ''
  });

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

  const { loading, error, data } = useQuery(GET_REPAIRS, {});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleLimitChange = event => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRepairEdit = i => {
    setEditMode(true);
    const dataOfEditedRow = data.getRepairs.repairs.slice(0, limit)[i];
    setRowData(dataOfEditedRow);
  };

  const handleRepairDelete = event => {
    setDeleteMode(true);
  };

  const handleEditClosed = () => setEditMode(false);
  const handleRepairClosed = () => setDeleteMode(false);

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
                <TableCell>Remarks</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>

                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.getRepairs.repairs.slice(0, limit).map((entry, i) => (
                <TableRow key={i}>
                  <TableCell>{entry.device.serialNumber}</TableCell>
                  <TableCell>{entry.device.description}</TableCell>
                  <TableCell>{entry.device.category}</TableCell>
                  <TableCell>{entry.repairDescription}</TableCell>
                  <TableCell>{entry.device.employee.name}</TableCell>
                  <TableCell>{entry.device.employee.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      className={classes.margin}
                    >
                      {entry.status}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {moment(entry.createdDate, 'x').format(
                      'DD MMM YYYY hh:mm A'
                    )}
                  </TableCell>
                  <TableCell padding="checkbox">
                    <IconButton
                      aria-label="edit"
                      onClick={e => handleRepairEdit(i)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <IconButton
                      aria-label="delete"
                      onClick={handleRepairDelete}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <EditRepair
          isEditMode={isEditMode}
          handleClosed={handleEditClosed}
          rowData={rowData}
        />
        <DeleteRepair isOpen={isDeleteMode} handleClosed={handleRepairClosed} />
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.getRepairs.repairs.length}
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
