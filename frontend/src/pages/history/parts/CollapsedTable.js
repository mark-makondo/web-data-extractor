import React from 'react';
import PropTypes from 'prop-types';

// material ui
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

// parts
import PaginationActionContainer from './paginationActions/PaginationActionContainer.js';

// custom hooks
import { UsePagination } from 'hooks/UsePagination.js';

const Columns = ({ tableValues, classes }) => {
    return (
        <TableRow>
            {tableValues.columns.length !== 0 &&
                tableValues.columns.map((item, i) => (
                    <TableCell key={i} className={classes.columns} align="center" children={item} />
                ))}
        </TableRow>
    );
};

const Rows = ({ doc, classes }) => {
    let rows = Object.values(doc);

    // dont include the first row which is just a key.
    rows.shift();

    return (
        <TableRow hover tabIndex={-1}>
            {rows.map((row, i) => (
                <Tooltip
                    key={i}
                    title={row ? row : 'Empty'}
                    arrow
                    children={<TableCell className={classes.rows} align="left" children={row} />}
                />
            ))}
        </TableRow>
    );
};

const CollapsedTable = (props) => {
    const { open, classes, tableValues } = props;

    const [page, rowsPerPage, handleChangePage, handleChangeRowsPerPage] = UsePagination();

    return (
        <TableRow className="collapsed-table">
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} size="small" aria-label="scraped data">
                                <TableHead>
                                    <Columns tableValues={tableValues} classes={classes} />
                                </TableHead>
                                <TableBody>
                                    {tableValues.result.length !== 0 &&
                                        tableValues.result
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((doc, i) => <Rows key={i} doc={doc} classes={classes} />)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            className="history-table__pagination"
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            component="div"
                            count={tableValues.result.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={PaginationActionContainer}
                        />
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};

CollapsedTable.propTypes = {
    tableValues: PropTypes.shape({
        rows: PropTypes.array.isRequired,
        columns: PropTypes.array.isRequired,
        result: PropTypes.array.isRequired,
    }).isRequired,
    open: PropTypes.bool.isRequired,
};

export default CollapsedTable;
