import React, { useCallback, useContext, useEffect, useState } from 'react';

// ui
import CapturedData from './CapturedData.js';

// context
import Context from 'store/context/Context.js';

const CapturedDataContainer = ({ setSavedKeywords }) => {
    const [scrapedData, setScrapedData] = useState([]);
    const [selected, setSelected] = useState([]);

    const {
        captureState: {
            capture: { data },
        },
    } = useContext(Context);

    const initializedData = useCallback(() => {
        setScrapedData(data);
    }, [data]);

    useEffect(() => {
        initializedData();
    }, [scrapedData, initializedData]);

    //** TABLE SELECTION LOGIC **//

    const selectionValidator = (title) => {
        let selectedIndex = selected.indexOf(title);
        console.log(selectedIndex, 'selected Index');
        let newSelected = [];

        let compiled = [...selected];

        let filteredSelected = compiled.filter((selectedTitle) => {
            return selectedTitle !== title;
        });

        switch (selectedIndex) {
            case -1:
                newSelected = newSelected.concat(selected, title);
                setSelected([...filteredSelected, title]);

                break;
            case 0:
                newSelected = newSelected.concat(selected.slice(1));
                setSelected([...filteredSelected]);

                break;
            case selected.length - 1:
                newSelected = newSelected.concat(selected.slice(0, -1));
                setSelected([...filteredSelected]);

                break;
            case selectedIndex > 0:
                newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
                setSelected([...filteredSelected]);

                break;
            default:
                newSelected = [];
                setSelected([]);

                break;
        }
        setSelected(newSelected);
    };

    const isSelected = (title) => selected.indexOf(title) !== -1;

    const itemPreviewClick = (e, title) => {
        const node_name = e.target.nodeName;
        if (node_name === 'A' || node_name === 'svg' || node_name === 'BUTTON') return;
        selectionValidator(title);
    };

    return (
        <CapturedData
            capturedData={data}
            itemPreviewClick={itemPreviewClick}
            isSelected={isSelected}
            selected={selected}
            setSelected={setSelected}
            setSavedKeywords={setSavedKeywords}
        />
    );
};

export default CapturedDataContainer;
