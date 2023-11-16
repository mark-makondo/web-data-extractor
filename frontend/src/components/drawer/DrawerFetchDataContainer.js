import React, { useState, useEffect, useContext, useCallback } from 'react';

// ui
import DrawerFetchData from './DrawerFetchData';

// context
import Context from 'store/context/Context';
import { StartCaptureData, KeywordScrape } from 'store/actions/captureActions';
import { AddDetails, AddFollowLinks, AddSelectorForMultiple } from 'store/actions/detailsActions';
import { GetTarget } from 'store/actions/targetActions';

// axios
import axiosInstance from 'helper/axiosInstance.js';

// modal
import ContainerAlert from 'components/modals/alert/Alert';

// component
import drawerNotication from 'components/notification/notification';

import {
    getSelectorForElement,
    convertTargetToSelector,
    getSpecificSelectorForElement,
    resetAllConfig,
    capitalize,
} from 'helper/functions';

const DrawerFetchDataContainer = ({
    drawerTitle,
    showDrawer,
    setShowDrawer,
    selectedElementType,
    selectedElementText,
    urlState,
    savedKeywords,
    targetElement,
    onSearch,
}) => {
    const [title, setTitle] = useState('');
    const [titleValidateStatus, setTitleValidateStatus] = useState('warning');
    const [drawerMaskClosable, setDrawerMaskClosable] = useState(true);
    const [drawerClosable, setDrawerClosable] = useState(true);
    const [isToggleChecked, setIsToggleChecked] = useState(false);
    const [disableSetAsContainer, setDisableSetAsContainer] = useState(true);
    const [disableToggleChecked, setDisableToggleChecked] = useState(true);
    const [containerClickAlertOpen, setContainerClickAlertOpen] = useState(false);

    const {
        captureState: {
            capture: { data, loading },
        },
        captureDispatch,
        targetDispatch,
        targetState: { target },

        detailsState,
        detailsDispatch,
    } = useContext(Context);

    //** TITLE INPUT LOGIC **//

    useEffect(() => {
        !!drawerTitle && setTitle(drawerTitle);
    }, [drawerTitle]);

    const titleValidation = useCallback(() => {
        if (title) {
            let titleFound = data.some((el) => el.title === title);

            if (!titleFound) return setTitleValidateStatus('success');

            return setTitleValidateStatus('error');
        }

        return setTitleValidateStatus('warning');
    }, [title, data]);

    useEffect(() => {
        titleValidation();
    }, [titleValidation]);

    const onTitleChanged = (e) => {
        let currentTarget = e.target;
        let captalizeValue = capitalize(currentTarget.value);

        setTitle(captalizeValue);
    };

    //** RELATIONAL CAPTURE LOGIC  **//

    const elementContainerValidation = useCallback(() => {
        let isElementHasChild, isContainerAlreadyExist;

        isElementHasChild = target.data.targetElement?.children.length >= 1;
        isContainerAlreadyExist = !!target.data.groupContainerSelector;

        if (target.data.targetElement?.children) {
            if (isElementHasChild && !isContainerAlreadyExist) setDisableSetAsContainer(false);
            else setDisableSetAsContainer(true);
        }

        if (isContainerAlreadyExist) {
            setIsToggleChecked(true);
            setDisableToggleChecked(false);
        } else setDisableToggleChecked(true);
    }, [target.data.groupContainerSelector, target.data.targetElement?.children]);

    useEffect(() => {
        elementContainerValidation();
    }, [elementContainerValidation]);

    const onToggleChange = async (current) => {
        setIsToggleChecked(current);

        if (current) GetTarget({ groupContainerEnabled: current })(targetDispatch);

        let message = `Container was ${current ? 'Set' : 'Removed'}`;
        let description = current
            ? 'Only select elements inisde of the container.'
            : 'Config was resetted, you can now select elements anywhere.';

        drawerNotication('warn', 'topLeft', message, description);

        !current && resetAllConfig(captureDispatch, targetDispatch);
    };

    const onContainerAlertOkClick = () => {
        // let qsClassSelector, querySelector, toInsert;
        let keysToNotRemove = ['targetElement', 'nextPageSelector', 'groupContainerEnabled', 'groupContainerSelector'];

        resetAllConfig(captureDispatch, targetDispatch, detailsDispatch, keysToNotRemove);
        setContainerClickAlertOpen(false);
        setShowDrawer(false);

        // qsClassSelector = target.data.targetClasses.map((c) => `.${c}`);
        // querySelector = `${selectedElementType}${qsClassSelector.join('')}`;

        //? update new
        // const querySelector = getSelectorForElement(target.data.targetElement, true, 0);
        let querySelector = getSelectorForElement(target.data.targetElement, false, 1, 1);
        console.log('container selector => ', querySelector);

        const toInsert = {
            groupContainerSelector: querySelector,
            groupContainerEnabled: true,
        };

        GetTarget(toInsert)(targetDispatch);
        setIsToggleChecked(true);
    };

    const setAsContainerClick = () => {
        setContainerClickAlertOpen(true);
    };

    //** BASIC SCRAPING OPTIONS LOGIC **//

    const onCaptureInnerText = () => {
        //? new way
        const resultNeeded = 'innerText';
        let selector = getSelectorForElement(target.data.targetElement, true, 2, 1);
        if (target.data.groupContainerEnabled) selector = convertTargetToSelector(target.data.targetElement); // group selector get first selector
        console.log('innerText selector => ', selector);
        fetchData(selector, title, resultNeeded);
    };

    const onCaptureHref = () => {
        const targetElement = target.data.targetElement;
        const closestTargetAnchor = target.data.targetElement.closest('a');
        const resultNeeded = 'href';

        let selector = getSelectorForElement(closestTargetAnchor, true, 2, 1);

        if (target.data.groupContainerEnabled) selector = convertTargetToSelector(targetElement);

        console.log('link selector => ', selector);
        fetchData(selector, title, resultNeeded);
    };

    const onCaptureImage = () => {
        //? new way
        const resultNeeded = 'img';
        let selector = getSelectorForElement(target.data.targetElement, true, 2, 1);
        if (target.data.groupContainerEnabled) selector = convertTargetToSelector(target.data.targetElement); // group selector get first selector
        console.log('image selector => ', selector);
        fetchData(selector, title, resultNeeded);
    };

    const fetchData = async (selector, dataTitle, resultNeeded) => {
        try {
            let params, res;

            setDrawerMaskClosable(false);
            setDrawerClosable(false);

            params = {
                url: urlState,
                selectors: selector,
                resultNeeded: resultNeeded,
                title: dataTitle,
                subTitle: dataTitle,
                browserId: detailsState.details.puppeteerBrowserReference,
            };
            // console.log(savedKeywords, ' saved keywords');
            if ((savedKeywords.length !== 0 && savedKeywords[0].split(',').length >= 2) || savedKeywords.length >= 2) {
                params['searchUrls'] = detailsState.details.searchUrls;
                res = await KeywordScrape(params)(captureDispatch);
            } else {
                res = await StartCaptureData(params)(captureDispatch);
            }

            if (res) {
                setShowDrawer(false);
                setTitle('');
                setDrawerMaskClosable(true);
                setDrawerClosable(true);

                drawerNotication('success', 'topLeft', 'Status', 'Data has been added to Captured Data Preview.');

                AddDetails({ ...params, isFollowedLink: detailsState.details.isFollowedLinkIdentifier })(
                    detailsDispatch
                );
            }
        } catch (error) {
            console.error(error);

            setDrawerMaskClosable(true);
            setDrawerClosable(true);

            drawerNotication('error', 'topLeft', 'Status', error);
        }
    };

    //** OTHERS SCRAPING OPTIONS LOGIC*/

    const followLinkClick = async () => {
        try {
            const closestTargetAnchor = target.data.targetElement.closest('a');

            if (closestTargetAnchor) {
                const url = closestTargetAnchor.href;

                //? new way
                let followLinkSelectorWithParent = getSelectorForElement(closestTargetAnchor, true, 2, 0);
                console.log('follow link selector => ', followLinkSelectorWithParent);
                //? new way

                //get url state from original site
                const params = {
                    url: urlState,
                    selectors: followLinkSelectorWithParent,
                    nextPageSelector: target.data.nextPageSelector,
                    browserId: detailsState.details.puppeteerBrowserReference,
                };

                let res = await axiosInstance().get(`/webscrape-action/visit-follow-link`, { params });

                if (res.data.result) {
                    //add follow link details
                    // followLinks: [],
                    // followLinksMultipleSelector: '',
                    // console.log('followLinks', res.data.data);
                    AddFollowLinks(res.data.data)(detailsDispatch);
                    // AddFollowLinkIdentifier(true)(detailsDispatch);
                    AddSelectorForMultiple(followLinkSelectorWithParent)(detailsDispatch);
                    // AddDetails({
                    //     ...params,
                    //     followLinksMultipleSelector: followLinkSelectorWithParent,
                    // })(detailsDispatch);

                    setShowDrawer(false);
                    //on search && render new page
                    onSearch(url, true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const nextPageClick = () => {
        let selector = selectedElementType;
        selector = getSpecificSelectorForElement(target.data.targetElement);
        console.log('next page selector => ', selector);

        GetTarget({ nextPageSelector: selector })(targetDispatch);
        setShowDrawer(false);
    };

    //**  DRAWER LOGIC **//

    const onDrawerClose = () => {
        setShowDrawer(false);
        setTitle('');
    };

    return (
        <>
            <DrawerFetchData
                showDrawer={showDrawer}
                selectedElementText={selectedElementText}
                selectedElementType={selectedElementType}
                title={title}
                onTitleChanged={onTitleChanged}
                titleValidateStatus={titleValidateStatus}
                scrapeLoading={loading}
                onCaptureInnerText={onCaptureInnerText}
                onCaptureHref={onCaptureHref}
                onCaptureImage={onCaptureImage}
                drawerMaskClosable={drawerMaskClosable}
                drawerClosable={drawerClosable}
                followLinkClick={followLinkClick}
                nextPageClick={nextPageClick}
                setAsContainerClick={setAsContainerClick}
                disableSetAsContainer={disableSetAsContainer}
                isToggleChecked={isToggleChecked}
                onToggleChange={onToggleChange}
                disableToggleChecked={disableToggleChecked}
                savedKeywords={savedKeywords}
                targetElement={targetElement}
                capturedData={data}
                onDrawerClose={onDrawerClose}
            />
            <ContainerAlert
                open={containerClickAlertOpen}
                setOpen={setContainerClickAlertOpen}
                title="Setting the Element as a Container"
                description="Other elements outside of the container will not be clickable unless this is disabled. This includes the set as next page which is for multiple page."
                handleOk={onContainerAlertOkClick}
            />
        </>
    );
};

export default DrawerFetchDataContainer;
