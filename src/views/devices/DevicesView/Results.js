/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
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
  Tooltip,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Select,
  Grid,
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import DeleteIcon from '@material-ui/icons/Delete';
import BugReportIcon from '@material-ui/icons/BugReport';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useQuery, gql } from '@apollo/client';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MoreIcon from '@material-ui/icons/More';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import AssignmentInfo from './AssignmentInfo';
import RepairDevice from './RepairDevice';
import DeleteDevice from './DeleteDevice';

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(2)
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// eslint-disable-next-line react/prop-types
const Results = ({ className, devices, ...rest }) => {
  const classes = useStyles();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [keyword, setkeyword] = useState('');
  const [isDeleteMode, setDeleteMode] = useState(false);
  const [isRepairMode, setRepairMode] = useState(false);
  const [isAssignmentMode, setAssignmentMode] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [rowData, setRowData] = useState({});
  const [status, setStatus] = useState('ALL');

  const GET_DEVICES = gql`
    query GET_DEVICES($pageSize: Int, $after: String, $keyword: String, $deviceStatus: String) {
      getDevices(pageSize: $pageSize, after: $after, keyword: $keyword, deviceStatus: $deviceStatus) {
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

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeviceRepair = (i) => {
    setRepairMode(true);
    const dataOfSelectedRow = data.getDevices.devices.slice(0, limit)[i];
    setRowData(dataOfSelectedRow);
  };

  const handleAssignmentInfo = (i) => {
    setAssignmentMode(true);
    const dataOfSelectedRow = data.getDevices.devices.slice(0, limit)[i];
    setRowData(dataOfSelectedRow);
  };

  const handleDeviceDelete = (i) => {
    setDeleteMode(true);
    const dataOfSelectedRow = data.getDevices.devices.slice(0, limit)[i];
    setRowData(dataOfSelectedRow);
  };

  const { loading, error, data } = useQuery(GET_DEVICES, {
    variables: {
      pageSize: limit,
      after: (page * limit).toString(),
      keyword,
      deviceStatus: status,
    },
    fetchPolicy: 'network-only'
  });

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(</p>;

  const handleDialogClosed = (args) => {
    setDeleteMode(false);
    setRepairMode(false);
    setAssignmentMode(false);

    if (args != null && args.confirmed === true) {
      setMessage(args.message);
      setSnackBarOpen(true);
    }
  };

  const handleSearch = (event) => {
    const searchQuery = event.target.value;

    if (event.key === 'Enter') {
      setkeyword(searchQuery);
    }
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={3}>
                <Box maxWidth={800}>
                  <TextField
                    onKeyPress={handleSearch}
                    defaultValue={keyword}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon fontSize="small" color="action">
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Search"
                    variant="outlined"
                  />

                </Box>
              </Grid>

              <Grid item xs={3}>
                <FormControl className={classes.formControl}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-readonly-label"
                    id="demo-simple-select-readonly"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="ALL">All</MenuItem>
                    <MenuItem value="AVAILABLE">Available</MenuItem>
                    <MenuItem value="ASSIGNED">Assigned</MenuItem>
                    <MenuItem value="IN_REPAIR">In Repair</MenuItem>
                  </Select>

                </FormControl>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      </Box>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial Number</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Added Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.getDevices.devices.slice(0, limit).map((entry, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <TableRow key={i}>
                  <TableCell>{entry.serialNumber}</TableCell>
                  <TableCell>{entry.deviceCategory.name}</TableCell>
                  <TableCell>{entry.model}</TableCell>
                  <TableCell>{entry.deviceStatus}</TableCell>
                  <TableCell>
                    {moment(entry.createdAt, 'x').format('DD MMM YYYY hh:mm A')}
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Link to={`${entry.id}`}>
                      <Tooltip title="More info">
                        <IconButton aria-label="More info">
                          <MoreIcon />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Tooltip title="Assignment info">
                      <IconButton
                        aria-label="Assignment info"
                        onClick={(e) => handleAssignmentInfo(i)}
                      >
                        <AccountCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  <TableCell padding="checkbox">
                    <Tooltip title="Add to repair">
                      <IconButton
                        aria-label="repair"
                        onClick={(e) => handleDeviceRepair(i)}
                        disabled={(entry.deviceStatus) === 'IN_REPAIR'}
                      >
                        <BugReportIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Tooltip title="Delete entry">
                      <IconButton
                        aria-label="delete"
                        onClick={(e) => handleDeviceDelete(i)}
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
        {isRepairMode ? (
          <RepairDevice
            isRepairMode={isRepairMode}
            handleClosed={handleDialogClosed}
            rowData={rowData}
          />
        ) : null}
        {isDeleteMode ? (
          <DeleteDevice
            isDeleteMode={isDeleteMode}
            handleClosed={handleDialogClosed}
            rowData={rowData}
            getDevicesQuery={GET_DEVICES}
          />
        ) : null}
        {isAssignmentMode ? (
          <AssignmentInfo
            isAssignmentMode={isAssignmentMode}
            handleClosed={handleDialogClosed}
            rowData={rowData}
          />
        ) : null}
        <div className={classes.root}>
          <Snackbar
            open={snackBarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackBarOpen(false)}
          >
            <Alert severity="success">{message}</Alert>
          </Snackbar>
        </div>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.getDevices.totalCount}
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
