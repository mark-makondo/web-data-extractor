import React, { createRef, useCallback, useEffect, useState } from 'react';

// ui
import Body from './Body.js';

// helper
import { capitalize, convertArraysToObjects, tableSorter } from 'helper/functions.js';

// table parts
import getColumnSearchProps from '../getColumnSearchProps.js';

const BodyContainer = (props) => {
    const { loading, capturedData, spinnerText } = props;

    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);

    const searchInputRef = createRef(null);

    //** SEARCH LOGIC **//

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };

    /**
     * Get the title from the original array and convert it to be
     * used in the table.
     *
     * @param {Array} saveDoc original array.
     * @returns [{tile1},{tile1},{tile1}] or [title1, title2,title3]
     */
    const getTableColumns = useCallback(
        (saveDoc) => {
            let tableColumnsHolder = [];
            let tableTitleHolder = [];

            saveDoc.forEach((doc, i) => {
                let title = doc.subTitle;

                tableColumnsHolder.push({
                    key: i,
                    title: capitalize(title),
                    dataIndex: title,
                    ellipsis: true,
                    width: 100,
                    sorter: (a, b) => tableSorter(title, a, b),
                    sortDirections: ['descend', 'ascend'],
                    ...getColumnSearchProps(title, handleSearch, handleReset, searchInputRef),
                });

                tableTitleHolder.push(title);
            });

            return { arrayOfObj: tableColumnsHolder, arrayOfTitle: tableTitleHolder };
        },
        [searchInputRef]
    );

    /**
     * converts the array of savedDoc to a number of objects
     * depending on the largest length of the savedDoc. Each object
     * is equivalent to a row in the table.
     *
     * @param {Array} data original array.
     * @param {Array} column  the array of title.
     * @returns [[data1],[data2],[data3],[data4]]
     */
    const getTableData = (saveDoc, column) => {
        let tableDataHolder, tableData;

        tableDataHolder = [];

        saveDoc.forEach((doc, i) => {
            let rows = doc.data;

            tableDataHolder.push(rows);
        });

        tableData = convertArraysToObjects(tableDataHolder, column);

        return tableData;
    };

    const populateTableWithCapturedData = useCallback(() => {
        let tableColumns, tableData, originalArray;

        if (!!capturedData.saveDoc && capturedData.saveDoc.length !== 0) {
            originalArray = capturedData.saveDoc;

            tableColumns = getTableColumns(originalArray);
            tableData = getTableData(originalArray, tableColumns.arrayOfTitle);

            setColumns(tableColumns.arrayOfObj);
            setData(tableData);
        } else {
            setColumns([]);
            setData([]);
        }

        // lets ignore eslint error for now since adding getTableColumns produces infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [capturedData]);

    useEffect(() => {
        let isCapturedDataEmpty;

        isCapturedDataEmpty = capturedData.length === 0;

        if (!isCapturedDataEmpty) {
            populateTableWithCapturedData();
        }

        return () => {
            populateTableWithCapturedData();
        };
    }, [populateTableWithCapturedData, capturedData.length]);

    return (
        <Body columns={columns} data={data} capturedData={capturedData} loading={loading} spinnerText={spinnerText} />
    );
};

export default BodyContainer;
