import { useState } from 'react';

export const UsePagination = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return [page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, setPage];
};
