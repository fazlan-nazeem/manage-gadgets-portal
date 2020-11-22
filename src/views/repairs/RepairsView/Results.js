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
  Button,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EditRepair from './EditRepair';
import DeleteRepair from './DeleteRepair';
import { useQuery, gql } from '@apollo/client';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  avatar: {
    marginRight: theme.spacing(2)
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

const Results = ({ className, ...rest }) => {
  const classes = useStyles();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [keyword, setkeyword] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [isDeleteMode, setDeleteMode] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [rowData, setRowData] = useState({});

  const GET_REPAIRS = gql`
    query GET_REPAIRS($pageSize: Int, $after: String, $keyword: String) {
      getRepairs(pageSize: $pageSize, after: $after, keyword: $keyword) {
        hasMore
        totalCount
        repairs {
          id
          status
          description
          agent
          createdAt
          device {
            id
            serialNumber
            model
            description
            deviceCategory {
              name
            }
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_REPAIRS, {
    variables: {
      pageSize: limit,
      after: (page * limit).toString(),
      keyword: keyword
    },
    fetchPolicy: 'network-only'
  });

  if (loading) return <CircularProgress />;
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

  const handleRepairDelete = i => {
    setDeleteMode(true);
    const dataOfDeleteRow = data.getRepairs.repairs.slice(0, limit)[i];
    setRowData(dataOfDeleteRow);
  };

  const handleDialogClosed = args => {
    setEditMode(false);
    setDeleteMode(false);
    if (args != null && args.confirmed === true) {
      setMessage(args.message);
      setSnackBarOpen(true);
    }
  };

  const handleSearch = event => {
    let searchQuery = event.target.value;

    if (event.key === 'Enter') {
      setkeyword(searchQuery);
    }
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
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
          </CardContent>
        </Card>
      </Box>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial Number</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Status</TableCell>

                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.getRepairs.repairs.slice(0, limit).map((entry, i) => (
                <TableRow key={i}>
                  <TableCell>{entry.device.serialNumber}</TableCell>
                  <TableCell>{entry.device.model}</TableCell>
                  <TableCell>{entry.device.deviceCategory.name}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.agent}</TableCell>
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
                    {moment(entry.createdAt, 'x').format('DD MMM YYYY hh:mm A')}
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
                      onClick={e => handleRepairDelete(i)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        {isEditMode ? (
          <EditRepair
            isEditMode={isEditMode}
            handleClosed={handleDialogClosed}
            rowData={rowData}
          />
        ) : null}
        {isDeleteMode ? (
          <DeleteRepair
            isOpen={isDeleteMode}
            rowData={rowData}
            handleClosed={handleDialogClosed}
            getRepairsQuery={GET_REPAIRS}
          />
        ) : null}
      </PerfectScrollbar>
      <div className={classes.root}>
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackBarOpen(false)}
        >
          <Alert severity="success">{message}</Alert>
        </Snackbar>
      </div>
      <TablePagination
        component="div"
        count={data.getRepairs.totalCount}
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
