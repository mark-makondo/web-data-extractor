import React from 'react';
import PropTypes from 'prop-types';

// material ui
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        color: '#e9e9e9',
        background: '#464646',
        fontWeight: '600',
        textTransform: 'capitalize',
    },

    highlight:
        theme.palette.type === 'light'
            ? {
                  color: '#e9e9e9',
                  background: '#2374de',
                  fontWeight: '700',
                  textTransform: 'capitalize',
              }
            : {
                  color: '#e9e9e9',
                  background: '#464646',
                  fontWeight: '600',
                  textTransform: 'capitalize',
              },
    title: {
        flex: '1 1 100%',
        letterSpacing: '0.0600rem',
        color: 'white',
        fontWeight: '600',
    },

    button: {
        color: 'white',
    },
}));

const EnhancedToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected, exportToExcelClick, deleteClick } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Extracted Data History
                </Typography>
            )}

            {numSelected > 0 && (
                <>
                    <Tooltip title="Delete">
                        <IconButton className={classes.button} onClick={deleteClick} aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export to Excel">
                        <IconButton
                            className={classes.button}
                            onClick={exportToExcelClick}
                            aria-label="export to excel"
                        >
                            <GetAppIcon />
                        </IconButton>
                    </Tooltip>
                </>
            )}
        </Toolbar>
    );
};

EnhancedToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default EnhancedToolbar;
