import React from 'react';

// antd
import { Collapse, Divider } from 'antd';

// parts
import ScrapeData from './parts/ScrapedData.js';
import ButtonsContainer from './parts/buttons/ButtonsContainer.js';

const { Panel } = Collapse;

const CapturedData = ({ capturedData, itemPreviewClick, isSelected, selected, setSelected, setSavedKeywords }) => {
    return (
        <Collapse className={`${capturedData.length === 0 && 'no-data'}`} bordered={false} expandIconPosition="left">
            <Panel className="normal-2" header="Captured Data Preview" key="1">
                {capturedData.length > 0 && (
                    <ButtonsContainer
                        capturedData={capturedData}
                        selected={selected}
                        setSelected={setSelected}
                        setSavedKeywords={setSavedKeywords}
                    />
                )}
                <Divider />

                <div className="grid-container">
                    {capturedData.map((obj, i) => (
                        <ScrapeData
                            key={`${obj.title}-${i}`}
                            title={obj.title}
                            data={obj.savedDoc}
                            isSelected={isSelected}
                            itemPreviewClick={itemPreviewClick}
                        />
                    ))}
                </div>
            </Panel>
        </Collapse>
    );
};

export default CapturedData;
