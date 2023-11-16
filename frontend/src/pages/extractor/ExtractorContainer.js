import React, { useCallback, useContext, useEffect, useState } from 'react';
import { notification } from 'antd';

// ui
import Extractor from './Extractor.js';

// ant
import 'antd/dist/antd.css'; //! # "antd/dist/antd.css"; or 'antd/dist/antd.less'

// helper
import axiosInstance from 'helper/axiosInstance.js';
import { resetAllConfig } from 'helper/functions.js';

// context
import Context from 'store/context/Context';
import {
    AddFollowLinkIdentifier,
    SetPuppeteerBrowserReference,
    SetMainUrl,
    SetFollowLinkUrl,
    AddFollowLinks,
    SetSearchUrls,
} from 'store/actions/detailsActions';

// alert
import InteractAlert from 'components/modals/alert/Alert';

//socket
import { SocketContext } from 'store/context/SocketContext.js';

const ExtractorContainer = () => {
    const socket = useContext(SocketContext);
    const invalidUrl = (placement) => {
        notification['error']({
            message: 'ERROR',
            description: 'Please Enter a Valid URL',
            duration: 1,
            placement,
        });
    };

    const [urlState, setUrlState] = useState(
        'https://www.yell.com/ucs/UcsSearchAction.do?scrambleSeed=1817584326&companyName=Accountants&location=LOndon'
    );
    const [htmlState, setHtmlState] = useState('');
    // const [classesState, setClassesState] = useState([]);
    const [capturedData, setCapturedData] = useState([]); //for collapse data
    const [captureState, setCaptureState] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [finalKeywords, setFinalKeywords] = useState([]);
    const [savedKeywords, setSavedKeywords] = useState([]);
    const [keywordsButton, setkeywordsButton] = useState(true);
    const [targetInput, setTargetInput] = useState('');
    const [contentClickAlertOpen, setContentClickAlertOpen] = useState(false);

    const {
        captureDispatch,
        targetDispatch,
        captureState: { capture },
        targetState: { target },
        detailsState,
        detailsDispatch,
    } = useContext(Context);

    const withHttp = (url) => (!/^https?:\/\//i.test(url) ? `https://www.${url}` : url);
    const isValidUrl = (url) =>
        /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(url);

    const blankPage = (site) => site === '<html><head></head><body></body></html>';

    const onSearch = (value, followLinkPage = false) => {
        value = value.trim();
        // document.getElementById("html__content").innerHTML = "";
        setUrlState(withHttp(value));
        // console.log(withHttp(value));
        // return;
        setPageLoading(true); //loading the page
        let url = withHttp(value);
        const params = {
            url: url,
            followLinkPage,
            browserId: detailsState.details.puppeteerBrowserReference,
        };

        if (!followLinkPage) {
            AddFollowLinkIdentifier(false)(detailsDispatch);
            SetMainUrl(url)(detailsDispatch);
            SetFollowLinkUrl(null)(detailsDispatch); //clear followlink url for new page render
            AddFollowLinks('')(detailsDispatch); //clear followlinks
        } else {
            AddFollowLinkIdentifier(true)(detailsDispatch);
            SetFollowLinkUrl(url)(detailsDispatch);
        }

        if (isValidUrl(url)) {
            axiosInstance()
                .get(`/webscrape-action/fetch-content`, { params })
                .then((res) => {
                    if (!blankPage(res.data.content)) {
                        setHtmlState(res.data.content);
                        socket.connect();
                        socket.emit('browserDisconnect', res.data.browserId);
                        SetPuppeteerBrowserReference(res.data.browserId)(detailsDispatch);
                    } else {
                        invalidUrl('topLeft');
                    }
                    setPageLoading(false); //stop loading the page
                    // document.getElementById("html__content").innerHTML = res.data;

                    //clear search urls
                    SetSearchUrls('')(detailsDispatch);
                })
                .catch((error) => {
                    console.log(error.response.data);
                    setPageLoading(false); //stop loading the page
                });
        } else {
            invalidUrl('topLeft');
            setPageLoading(false); //stop loading the page
            return;
        }

        setHtmlState('');
    };

    const keywordSearch = () => {
        // let types = [];
        // let finalTarget = [];
        // setSavedKeywords(finalKeywords);

        // for (let i = 0; i <= targetInput.length - 1; i++) {
        //     finalTarget[i] = targetInput[i].id ? targetInput[i].id : targetInput[i].class;
        //     types[i] = targetInput[i].id ? 'id' : 'class';
        //     console.log(targetInput[i].id, ' this is the ID');
        // }
        // // console.log(targetInput, ' target Input', ' type : ', types);
        // const params = {
        //     url: urlState,
        //     keywords: finalKeywords,
        //     selectors: finalTarget,
        //     type: types,
        //     browserId: detailsState.details.puppeteerBrowserReference,
        // };

        // setPageLoading(true);
        // axiosInstance()
        //     .get('/webscrape-action/search-keywords', { params })
        //     .then((res) => {
        //         setUrlState(res.data.url[0]);
        //         setHtmlState(res.data.html);
        //         setPageLoading(false);
        //     });

        // setFinalKeywords('');

        //? new approach
        setSavedKeywords(finalKeywords);
        let searchSelectors = [];
        for (let searchTarget of targetInput) {
            let classSelector = '';
            if (searchTarget.class) {
                const arrClass = searchTarget.class.split(' ');
                const arrClassNew = arrClass.filter((a) => a.trim() !== '');
                const pSelector = arrClassNew.map((c) => `.${c}`);
                classSelector = pSelector.join('');
            }
            const currentSelector = searchTarget.id
                ? `input#${searchTarget.id}`
                : searchTarget.class
                ? `input${classSelector}`
                : `input[name="${searchTarget.name}"]`;
            searchSelectors.push(currentSelector);
        }
        const params = {
            url: urlState,
            keywords: finalKeywords,
            selectors: searchSelectors,
            browserId: detailsState.details.puppeteerBrowserReference,
        };

        setPageLoading(true);
        axiosInstance()
            .get('/webscrape-action/search-keywords', { params })
            .then((res) => {
                setUrlState(res.data.urls[0]);
                setHtmlState(res.data.content);
                setPageLoading(false);
                //context update
                SetSearchUrls(res.data.urls)(detailsDispatch);
            });

        setFinalKeywords('');
        searchSelectors = [];
        setTargetInput([]);
        //? new approach
    };

    const showAlertWhenDataExists = useCallback(() => {
        let isCapturedDataExist = capture.data.length !== 0;
        let targetElement = target.data.targetElement;

        if (!captureState && (isCapturedDataExist || targetElement)) {
            setCaptureState(true);
            setContentClickAlertOpen(true);
        }
    }, [captureState, capture.data.length, target.data.targetElement]);

    useEffect(() => {
        showAlertWhenDataExists();
        return () => {
            showAlertWhenDataExists();
        };
    }, [showAlertWhenDataExists]);

    //clear every refresh
    useEffect(() => {
        resetAllConfig(captureDispatch, targetDispatch, detailsDispatch);
    }, []);

    //** Alert Logic **//

    const onAlertOkClick = () => {
        resetAllConfig(captureDispatch, targetDispatch, detailsDispatch);
        setContentClickAlertOpen(false);
        setCaptureState(false);
    };

    const switchChange = (value) => {
        setCaptureState(value);
    };

    return (
        <>
            <Extractor
                pageLoading={pageLoading}
                urlState={urlState}
                setUrlState={setUrlState}
                htmlState={htmlState}
                captureState={captureState}
                switchChange={switchChange}
                capturedData={capturedData}
                setCapturedData={setCapturedData}
                onSearch={onSearch}
                keywordsButton={keywordsButton}
                setkeywordsButton={setkeywordsButton}
                keywordSearch={keywordSearch}
                finalKeywords={finalKeywords}
                setFinalKeywords={setFinalKeywords}
                setTargetInput={setTargetInput}
                savedKeywords={savedKeywords}
                setSavedKeywords={setSavedKeywords}
                contentClickAlertOpen={contentClickAlertOpen}
            />

            <InteractAlert
                open={contentClickAlertOpen}
                setOpen={setContentClickAlertOpen}
                title="Previous Config will be Resetted"
                handleOk={onAlertOkClick}
            />
        </>
    );
};

export default ExtractorContainer;
