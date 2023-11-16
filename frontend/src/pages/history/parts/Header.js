import React from 'react';
import PropTypes from 'prop-types';

// material ui
import { makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const useStyles = makeStyles(() => ({
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    header: {
        fontWeight: 600,
        color: '#464646',
    },
}));

const headCells = [
    { id: 'title', align: 'center', disablePadding: false, label: 'Title' },
    { id: 'origin', align: 'center', disablePadding: false, label: 'Origin' },
    { id: 'date', align: 'center', disablePadding: false, label: 'Date Created' },
];

const Header = (props) => {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

    const classes = useStyles();

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableRow>
            <TableCell className={classes.header} align="center">
                Collapse
            </TableCell>
            <TableCell className={classes.header} padding="checkbox">
                <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                    inputProps={{ 'aria-label': 'select all data' }}
                />
            </TableCell>

            {headCells.map((headCell) => (
                <TableCell
                    className={classes.header}
                    key={headCell.id}
                    align={headCell.align}
                    padding={headCell.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === headCell.id ? order : false}
                >
                    <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                    >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                            <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                        ) : null}
                    </TableSortLabel>
                </TableCell>
            ))}
        </TableRow>
    );
};

Header.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default Header;
