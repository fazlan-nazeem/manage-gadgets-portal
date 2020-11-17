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
  SvgIcon
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { useQuery, gql } from '@apollo/client';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import DeleteCategory from './DeleteCategory';
import EditCategory from './EditCategory';

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

const GET_DEVICE_CATEGORIES = gql`
  query GET_DEVICE_CATEGORIES(
    $pageSize: Int
    $after: String
    $keyword: String
  ) {
    getDeviceCategories(pageSize: $pageSize, after: $after, keyword: $keyword) {
      hasMore
      totalCount
      deviceCategories {
        id
        name
        createdAt
      }
    }
  }
`;

const Results = ({ className, devices, ...rest }) => {
  const classes = useStyles();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [keyword, setkeyword] = useState('');
  const [isDeleteMode, setDeleteMode] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const { loading, error, data } = useQuery(GET_DEVICE_CATEGORIES);

  const [rowData, setRowData] = useState({});

  const handleLimitChange = event => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDialogClosed = args => {
    setEditMode(false);
    setDeleteMode(false);
    if (args != null && args.confirmed === true) {
      setMessage(args.message);
      setSnackBarOpen(true);
    }
  };

  const handleDeviceCategoryDelete = i => {
    setDeleteMode(true);
    const dataOfSelectedRow = data.getDeviceCategories.deviceCategories.slice(
      0,
      limit
    )[i];
    setRowData(dataOfSelectedRow);
  };

  const handleDeviceCategoryEdit = i => {
    setEditMode(true);
    const dataOfEditedRow = data.getDeviceCategories.deviceCategories.slice(
      0,
      limit
    )[i];
    setRowData(dataOfEditedRow);
  };

  const handleSearch = event => {
    let searchQuery = event.target.value;

    if (event.key === 'Enter') {
      setkeyword(searchQuery);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

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
                <TableCell>Name</TableCell>

                <TableCell>Added Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.getDeviceCategories.deviceCategories
                .slice(0, limit)
                .map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>
                      {moment(entry.createdAt, 'x').format(
                        'DD MMM YYYY hh:mm A'
                      )}
                    </TableCell>
                    <TableCell padding="checkbox">
                      <IconButton
                        aria-label="edit"
                        onClick={e => handleDeviceCategoryEdit(i)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <Tooltip title="Delete entry">
                        <IconButton
                          aria-label="delete"
                          onClick={e => handleDeviceCategoryDelete(i)}
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
        {isEditMode ? (
          <EditCategory
            isEditMode={isEditMode}
            handleClosed={handleDialogClosed}
            rowData={rowData}
          />
        ) : null}
        {isDeleteMode ? (
          <DeleteCategory
            isOpen={isDeleteMode}
            rowData={rowData}
            handleClosed={handleDialogClosed}
            getDeviceCategoriesQuery={GET_DEVICE_CATEGORIES}
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
        count={data.getDeviceCategories.totalCount}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default Results;
