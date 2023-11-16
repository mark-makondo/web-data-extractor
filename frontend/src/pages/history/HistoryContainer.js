import React, { useCallback, useContext, useEffect, useState } from 'react';

// ui
import History from './History';

// context
import Context from 'store/context/Context.js';
import { GetScrapeData, DeleteScrapeData, ExcelScrapedData } from 'store/actions/scrapingActions.js';

// custom hooks
import { UsePagination } from 'hooks/UsePagination.js';

/**
 * 'selected' only contains the _id of all the selected data.
 * 'compiledData' contains the whole object of the selected data.
 */
const HistoryContainer = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('date');
    const [selected, setSelected] = useState([]);
    const [compiledData, setCompiledData] = useState([]);
    const [isAllClicked, setIsAllClicked] = useState(false);

    const [page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, setPage] = UsePagination();

    const {
        scrapeState: { scrape },
        scrapeDispatch,
    } = useContext(Context);

    const initializedData = useCallback(() => {
        setLoading(scrape.loading);
        setData(scrape.data);
    }, [scrape.loading, scrape.data]);

    useEffect(() => {
        initializedData();
    }, [initializedData]);

    useEffect(() => {
        GetScrapeData()(scrapeDispatch);
    }, [scrapeDispatch]);

    //** MATERIAL UI TABLE LOGIC **/

    const handleRequestSort = (event, property) => {
        let isAsc = orderBy === property && order === 'asc';

        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            let newSelecteds = data.map((n) => n._id);

            setSelected(newSelecteds);
            setCompiledData(data);
            setIsAllClicked(true);

            return;
        }
        setIsAllClicked(false);
        setSelected([]);
        setCompiledData([]);
    };

    const handleClick = (event, id, scrape) => {
        let collapsedIcon = document.querySelector(`.collapsed-icon-${scrape._id} svg`);

        if (collapsedIcon !== event.target) {
            let selectedIndex, newSelected, compiled, filteredData;

            selectedIndex = selected.indexOf(id);

            newSelected = [];

            compiled = [...compiledData];

            filteredData = compiled.filter((data) => {
                return data._id !== scrape._id;
            });

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, id);

                setCompiledData([...filteredData, scrape]);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));

                setCompiledData([...filteredData]);
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));

                setCompiledData([...filteredData]);
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));

                setCompiledData([...filteredData]);
            }

            setSelected(newSelected);
        }
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const exportToExcelClick = async () => {
        try {
            let format = {
                title: '',
                capturedData: compiledData,
            };

            if (compiledData.length === 1) {
                await ExcelScrapedData(format, 'single')();
            } else {
                await ExcelScrapedData(format, 'multiple')();
            }

            setCompiledData([]);
            setSelected([]);
            setIsAllClicked(false);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteClick = async (e) => {
        e.preventDefault();
        try {
            let conditionalInput = isAllClicked ? 'all' : selected;

            await DeleteScrapeData(conditionalInput, setPage)(scrapeDispatch);

            setSelected([]);
            setIsAllClicked(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <History
            loading={loading}
            data={data}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleRequestSort={handleRequestSort}
            handleSelectAllClick={handleSelectAllClick}
            handleClick={handleClick}
            isSelected={isSelected}
            selected={selected}
            order={order}
            orderBy={orderBy}
            exportToExcelClick={exportToExcelClick}
            deleteClick={deleteClick}
        />
    );
};

export default HistoryContainer;
