import React from 'react';

// material ui
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

// parts
import CollapsedTable from '../CollapsedTable.js';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    columns: {
        textTransform: 'capitalize',
        fontWeight: '600',
        maxWidth: '10rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },

    rows: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '10rem',
    },
    table: {
        minWidth: 650,
    },
});

const Row = (props) => {
    const { scrape, open, setOpen, handleClick, isSelected, tableValues } = props;
    const { _id, title, origin, createdAt } = scrape;

    const classes = useRowStyles();
    const isItemSelected = isSelected(_id);
    const labelId = `enhanced-table-checkbox-${_id}`;

    let convertedDate = new Date(createdAt).toDateString();

    const ColumnWithTooltip = ({ data, align }) => {
        return (
            <Tooltip
                title={data}
                arrow
                children={<TableCell className={classes.rows} align={align} children={data} />}
            />
        );
    };

    const columnHeadCells = [
        { label: title, align: 'left' },
        { label: origin, align: 'left' },
        { label: convertedDate, align: 'center' },
    ];

    return (
        <>
            <TableRow
                hover
                onClick={(e) => handleClick(e, _id, scrape)}
                role="checkbox"
                className={`table-row-${_id} ${classes.root}`}
                aria-checked={isItemSelected}
                tabIndex={-1}
                selected={isItemSelected}
            >
                <TableCell
                    align="center"
                    children={
                        <IconButton
                            className={`collapsed-icon collapsed-icon-${_id}`}
                            aria-label="expand scrape"
                            size="small"
                            onClick={() => setOpen(!open)}
                            children={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        />
                    }
                />

                <TableCell
                    padding="checkbox"
                    children={<Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />}
                />

                {columnHeadCells.map((cell, i) => (
                    <ColumnWithTooltip key={i} data={cell.label} align={cell.align} />
                ))}
            </TableRow>
            <CollapsedTable open={open} classes={classes} tableValues={tableValues} />
        </>
    );
};

export default Row;
