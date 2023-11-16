import React from 'react';

// material ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';

// parts
import Header from './parts/Header.js';
import PaginationActionContainer from './parts/paginationActions/PaginationActionContainer.js';
import RowContainer from './parts/row/RowContainer.js';
import EnhancedToolbar from './parts/EnhancedToolbar.js';

// helper
import { stableSort, getComparator } from 'helper/functions.js';

const History = (props) => {
    const {
        loading,
        data,
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        handleRequestSort,
        handleSelectAllClick,
        handleClick,
        isSelected,
        selected,
        order,
        orderBy,
        exportToExcelClick,
        deleteClick,
    } = props;

    return (
        <div className="history">
            <div className="history__body">
                {loading ? (
                    <CircularProgress className="history-loading" color="primary" />
                ) : (
                    <div className="history-table">
                        <TableContainer component={Paper}>
                            <EnhancedToolbar
                                numSelected={selected.length}
                                exportToExcelClick={exportToExcelClick}
                                deleteClick={deleteClick}
                            />
                            <Table aria-label="sticky collapsible table">
                                <TableHead>
                                    <Header
                                        numSelected={selected.length}
                                        order={order}
                                        orderBy={orderBy}
                                        onSelectAllClick={handleSelectAllClick}
                                        onRequestSort={handleRequestSort}
                                        rowCount={data.length}
                                    />
                                </TableHead>

                                <TableBody>
                                    {data.length !== 0 &&
                                        stableSort(data, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((scrape) => (
                                                <RowContainer
                                                    key={scrape._id}
                                                    scrape={scrape}
                                                    handleClick={handleClick}
                                                    isSelected={isSelected}
                                                />
                                            ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            className="history-table__pagination"
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={PaginationActionContainer}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
