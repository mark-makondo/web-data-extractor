import React from 'react';

// ui
import PaginationAction from './PaginationAction.js';

// material ui
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const PaginationActionContainer = (props) => {
    const { count, page, rowsPerPage, onChangePage } = props;

    const classes = useStyles1();
    const theme = useTheme();

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <PaginationAction
            handleFirstPageButtonClick={handleFirstPageButtonClick}
            handleBackButtonClick={handleBackButtonClick}
            handleNextButtonClick={handleNextButtonClick}
            handleLastPageButtonClick={handleLastPageButtonClick}
            classes={classes}
            theme={theme}
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
        />
    );
};

export default PaginationActionContainer;
