import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// ui
import Row from './Row.js';

// helper
import { convertArraysToObjects } from 'helper/functions.js';

const RowContainer = (props) => {
    const { scrape, handleClick, isSelected } = props;

    const [open, setOpen] = useState(false);
    const [tableValues, setTableValues] = useState({
        columns: [],
        rows: [],
        result: [],
    });

    const convertTitlesToSingleArray = useCallback((scrape) => {
        let titleArrayHolder = [];

        scrape &&
            scrape.savedDoc.forEach((doc) => {
                titleArrayHolder.push(doc.subTitle);
            });

        return titleArrayHolder;
    }, []);

    const convertSaveDocDataToASingleArray = useCallback((scrape) => {
        let saveDocDataArrayHolder = [];

        scrape &&
            scrape.savedDoc.forEach((doc) => {
                saveDocDataArrayHolder.push(doc.data);
            });

        return saveDocDataArrayHolder;
    }, []);

    useEffect(() => {
        if (scrape) {
            let rows, columns, result;

            rows = convertSaveDocDataToASingleArray(scrape);
            columns = convertTitlesToSingleArray(scrape);

            let isRowsExist = rows.length !== 0;
            let isColumnsExist = columns.length !== 0;

            if (isRowsExist && isColumnsExist) {
                result = convertArraysToObjects(rows, columns);

                setTableValues({
                    columns,
                    rows,
                    result,
                });
            }
        }

        return () => {
            convertSaveDocDataToASingleArray();
            convertTitlesToSingleArray();
            convertArraysToObjects();
        };
    }, [convertSaveDocDataToASingleArray, convertTitlesToSingleArray, scrape]);

    return (
        <Row
            scrape={scrape}
            open={open}
            setOpen={setOpen}
            handleClick={handleClick}
            isSelected={isSelected}
            tableValues={tableValues}
        />
    );
};

RowContainer.propTypes = {
    scrape: PropTypes.shape({
        title: PropTypes.string.isRequired,
        origin: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
};

export default RowContainer;
