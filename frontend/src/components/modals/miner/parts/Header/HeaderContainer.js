import React, { useContext, useState } from 'react';

// ui
import Header from './Header.js';

// axios
import axiosInstance from 'helper/axiosInstance.js';

// context
import Context from 'store/context/Context';
import { ExcelScrapedData } from 'store/actions/scrapingActions.js';
import { GetTarget } from 'store/actions/targetActions';

const HeaderContainer = (props) => {
    const {
        loading,
        setLoading,
        target,
        setCapturedData,
        capturedData,
        titleValidateStatus,
        onTitleChanged,
        title,
        setSpinnerText,
    } = props;

    const [pageNumberState, setPageNumberState] = useState(1);
    const [isCaptureAllChecked, setIsCaptureAllChecked] = useState(false);

    const {
        targetState: {
            target: { data },
        },
        // captureState: {
        //     capture: { data },
        // },
        targetDispatch,
        detailsState,
    } = useContext(Context);

    const { captureState } = useContext(Context);

    const captureDataClick = async () => {
        try {
            setSpinnerText('Fetching Captured Data, Please Wait ...');
            setLoading(true);
            const captureType = captureState.capture.data[0];
            const isKeyword = captureType.type !== undefined && captureType.type === 'keyword';
            let _isMultiPage, _isRelated, _nextPageSelector, _totalPages, querySelector, params, res;

            _isMultiPage = !!target.data.nextPageSelector;
            _isRelated = !!target.data.groupContainerEnabled;

            _nextPageSelector = _isMultiPage ? target.data.nextPageSelector : null;
            _totalPages = _isMultiPage && isCaptureAllChecked ? 0 : pageNumberState;

            querySelector = target.data.groupContainerSelector;

            params = {
                nextPageSelector: _nextPageSelector,
                total_pages: _totalPages,
                groupSelector: _isRelated ? querySelector : null,
                details: detailsState.details,
            };

            if (isKeyword) {
                // console.log('entered keyword');
                params['searchUrls'] = detailsState.details.searchUrls;
                params['browserId'] = detailsState.details.puppeteerBrowserReference;
                res = await axiosInstance().get(`/webscrape-action/start-scraping-keywords/`, { params });
            } else {
                // console.log('entered NORMAL');
                res = await axiosInstance().get(`/webscrape-action/start-scraping`, { params });
            }

            if (res.data) {
                setCapturedData(res.data);
                setLoading(false);
                GetTarget({ isMinerCaptured: true })(targetDispatch);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const onCheckBoxChanged = (e) => {
        let isChecked = e.target.checked;

        setIsCaptureAllChecked(isChecked);
    };

    const onPageNumberChanged = (value) => {
        setPageNumberState(value);
    };

    const exportDataClick = async () => {
        try {
            let toInsert;

            capturedData.title = title;
            toInsert = {
                ...capturedData,
            };
            await ExcelScrapedData(toInsert, 'capturer')();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Header
            title={title}
            onTitleChanged={onTitleChanged}
            titleValidateStatus={titleValidateStatus}
            loading={loading}
            exportDataClick={exportDataClick}
            pageNumberState={pageNumberState}
            onPageNumberChanged={onPageNumberChanged}
            captureDataClick={captureDataClick}
            onCheckBoxChanged={onCheckBoxChanged}
            isCaptureAllChecked={isCaptureAllChecked}
            capturedData={capturedData}
            data={data}
        />
    );
};

export default HeaderContainer;
