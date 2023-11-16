import React, { useCallback, useEffect, useState, useContext } from 'react';

// antd
import { notification, message } from 'antd';

// context
import Context from 'store/context/Context';
import { GetTarget } from 'store/actions/targetActions';

// ui
import SiteContent from './SiteContent';

// alert
import MinerCapturedAlert from 'components/modals/alert/Alert';

// helper
import { resetAllConfig, getSpecificSelectorForElement } from 'helper/functions';

const SiteContentContainer = ({
    content,
    captureState,
    urlState,
    setUrlState,
    capturedData,
    setCapturedData,
    onSearch,
    setkeywordsButton,
    finalKeywords,
    setFinalKeywords,
    setTargetInput,
    savedKeywords,
    setSavedKeywords,
    interactAlertOpen,
}) => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [targetClasses, setTargetClasses] = useState([]);
    const [selectedElementText, setSelectedElementText] = useState('');
    const [selectedElementAttributes, setSelectedElementAttributes] = useState([]);
    const [selectedElementType, setSelectedElementType] = useState([]);
    const [targetElement, setTargetElement] = useState(null);
    const [title, setTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedParent, setSelectedParent] = useState();
    const [contentClicked, setContentClicked] = useState(false);
    const [contentClickAlertOpen, setContentClickAlertOpen] = useState(false);
    const [selectedTargetParentSelector, setSelectedTargetParentSelector] = useState('');

    // targetHolder and targetElement holds the same thing but targetElement is used on the context.
    const [targetHolder, setTargetHolder] = useState(null);

    const { targetDispatch, targetState, captureDispatch, detailsDispatch } = useContext(Context);

    useEffect(() => {
        let data = {
            targetElement,
            targetClasses,
            selectedElementAttributes,
            selectedElementType,
            selectedTargetParentSelector,
        };
        GetTarget(data)(targetDispatch);
    }, [
        targetElement,
        targetClasses,
        selectedElementAttributes,
        selectedElementType,
        selectedTargetParentSelector,
        targetDispatch,
    ]);

    //** ON MOUSE DOUBLE CLICK ELEMENT LOGIC **/

    //! new
    const getParentSelector = (target) => {
        const parentElement = target.parentNode;
        // console.log('parentElement', parentElement);
        const arrParentClasses = parentElement.className.split(' ');
        let parentClassSelector = arrParentClasses.filter((c) => c !== '');
        parentClassSelector = parentClassSelector.map((c) => `.${c}`);
        const parentElementNodeName = parentElement.nodeName.toLowerCase();
        const targetParentSelector = `${parentElementNodeName}${parentClassSelector.join('')}`;
        // console.log('targetParentSelector', targetParentSelector);
        setSelectedTargetParentSelector(targetParentSelector);
    };

    // const getParentAnchor = (target) => {
    //     while (target.nodeName !== 'A' && target.nodeName !== 'HTML') {
    //         // console.log(target.nodeName);
    //         target = target.parentNode;
    //     }
    //     return target;
    // };

    const contentOnDoubleClick = (e) => {
        // if (!captureState) {
        //     const parentAnchorElement = getParentAnchor(e.target);
        //     const anchor_url = parentAnchorElement.getAttribute('href');
        //     if (anchor_url) {
        //         const base_url = new URL(urlState).origin;
        //         let hrefValue = anchor_url.startsWith('http') ? anchor_url : `${base_url}${anchor_url}`;
        //         setUrlState(hrefValue);
        //         onSearch(urlState);
        //     }
        // }
    };

    //** ON MOUSE HOVER ELEMENT LOGIC **/

    const contentOnMouseover = (e) => {
        if (captureState && !JSON.stringify(e.target.className).includes('rendered_container')) {
            let containerSelector, isSelectedContainer;

            containerSelector = targetState.target.data.groupContainerSelector;

            if (containerSelector) {
                isSelectedContainer =
                    !!selectedParent && JSON.stringify(e.target.className).includes(selectedParent.className);

                if (isSelectedContainer) return;
            }

            e.target.style.border = '2px dotted #E74D3D';
        }
    };

    const contentOnMouseout = (e) => {
        if (captureState && !JSON.stringify(e.target.className).includes('rendered_container')) {
            let containerSelector, isSelectedContainer;

            containerSelector = targetState.target.data.groupContainerSelector;

            if (!containerSelector && !showDrawer) return (e.target.style.border = 'none');

            isSelectedContainer =
                !!selectedParent && JSON.stringify(e.target.className).includes(selectedParent.className);

            if (isSelectedContainer && !showDrawer) return;
            else if (!isSelectedContainer && !showDrawer) return (e.target.style.border = 'none');
        }
    };

    //** ON MOUSE CLICK ELEMENT LOGIC **/

    const getAttributes = (attributes) => {
        let attributeNodeArray, attrs;

        attributeNodeArray = [...attributes];
        attrs = attributeNodeArray.reduce((attrs, attribute) => {
            attrs[attribute.name] = attribute.value;
            return attrs;
        }, {});

        return attrs;
    };

    const containerBorderAdderValidation = useCallback(() => {
        let containerSelector = targetState.target.data.groupContainerSelector;

        containerSelector && localStorage.setItem('containerSelector', containerSelector);

        if (containerSelector) {
            let parent = document.querySelector(containerSelector);

            setSelectedParent(parent);

            return parent.setAttribute('style', 'border: 2px solid red !important');
        } else {
            let storageSelector = localStorage.getItem('containerSelector');

            if (!!storageSelector) {
                let parent = document.querySelector(storageSelector);

                parent && parent.setAttribute('style', 'border: none');
                localStorage.removeItem('containerSelector');
            }
        }
    }, [targetState.target.data.groupContainerSelector]);

    const ifMinerCapturedExistShowAlert = useCallback(() => {
        let isMinerCapturedExist = !!targetState.target.data.isMinerCaptured;

        if (contentClicked && isMinerCapturedExist) {
            setContentClickAlertOpen(true);
            setContentClicked(false);
        }

        setContentClicked(false);
    }, [contentClicked, targetState.target.data.isMinerCaptured]);

    useEffect(() => {
        containerBorderAdderValidation();

        return () => {
            containerBorderAdderValidation();
        };
    }, [containerBorderAdderValidation]);

    useEffect(() => {
        ifMinerCapturedExistShowAlert();

        return () => {
            ifMinerCapturedExistShowAlert();
        };
    }, [ifMinerCapturedExistShowAlert]);

    useEffect(() => {
        if (contentClickAlertOpen) {
            setShowDrawer(false);
        }
    }, [contentClickAlertOpen]);

    //** ON CLICK LOGIC ON THE HTML CONTENT **//

    const contentOnClick = (e) => {
        e.preventDefault();

        if (!captureState) return;

        setContentClicked(true);

        let currentTarget, nodeName, attributes, classes, attrs, parentOfParent;
        let className, parentElement, parentClassNames, parentOfParentClassNames;

        // if (e.target.tagName === 'A') e.target.classList.add('disable');
        // console.log(e.target.getAttribute('href'));

        currentTarget = e.target;

        parentElement = currentTarget.parentElement;
        parentOfParent = parentElement.parentNode;

        nodeName = currentTarget.nodeName;
        attributes = currentTarget.attributes;

        className = currentTarget.className;
        parentClassNames = parentElement.className;
        parentOfParentClassNames = parentOfParent.className;

        // if a container was set, disable clicking outside
        if (targetState.target.data.groupContainerEnabled) {
            let parent = document.querySelector(targetState.target.data.groupContainerSelector);

            if (!parent.contains(currentTarget)) {
                return notification['warn']({
                    placement: 'topLeft',
                    message: 'Action Not Allowed',
                    description:
                        'Disable relational capture in the drawer if you want to select element outside of the container.',
                });
            }
        }

        getParentSelector(currentTarget); //? set class selector for current target parent

        attrs = getAttributes(attributes);

        if (nodeName === 'INPUT') {
            setTargetInput((prevAttr) => [...prevAttr, attrs]);
            // const searchTarget = getSpecificSelectorForElement(targetElement);
            // setTargetInput((prevTarget) => [...prevTarget, searchTarget]);
            setShowModal(true);
        }

        //? THE AUTO DETECTION OF DETAILS OF SIR CLIFFORD WAS MOVED TO autoDetectionDetails function
        //? and anything related to auto detection you can put it inside of that function.

        //TODO: temporary disable on error

        //TODO: temporary disable on error
        // console.log(parentOfParentClassNames);
        // Object.prototype.toString.call(obj) === '[object Object]'
        // console.log('className', className);
        // console.log('className', Object.prototype.toString.call(className));

        // if (!parentOfParentClassNames) classes = [];
        // else if (!parentClassNames) classes = parentOfParentClassNames.split(' ');
        // else if (!className) classes = parentClassNames.split(' ');
        // else if (Object.prototype.toString.call(className) === '[object Object]') classes = '';
        // else classes = className.split(' ');
        if (Object.prototype.toString.call(className) === '[object SVGAnimatedString]') classes = '';
        else classes = className.split(' ');
        //TODO: temporary disable on error

        setTargetHolder(currentTarget);
        setTargetElement(currentTarget);
        setSelectedElementType(nodeName.toLowerCase());
        setSelectedElementAttributes(attrs);
        setTargetClasses(classes);
    };

    const autoDetectionDetails = useCallback(() => {
        // Check if the class name contains "address"
        let hasClassName = !!targetElement.className;
        let parentElem = targetElement;
        let hasChildAddress = false;

        //TODO: temporary disable on error
        // This will check all the childnodes of the clicked element
        targetElement.childNodes.forEach((childs) => {
            if (hasClassName && !!childs.className && typeof childs.className === 'string')
                hasChildAddress = childs.className.includes('address');
        });
        //TODO: temporary disable on error

        // If selected element has no className this will check
        // the parent elements to look for an element that has
        // a class
        while (hasClassName === false) {
            parentElem = parentElem.parentElement;
            hasClassName = !!parentElem.className;
        }

        // let hasStreet =
        //     /^(?:[A-Za-z0-9.-]+\s?)+(?:Avenue|Lane|Road|Boulevard|Drive|Street|Ave|Dr|Rd|Blvd|Ln|St|City)\.?/i.test(
        //         parentElem.innerText
        //     );

        // This will initialize the title to be passed to the Drawer
        setTitle('');

        if (typeof parentElem.className === 'string') {
            if (parentElem.className.includes('address') || hasChildAddress) {
                setTitle('Address');
                console.log(title, 'address');
            } else if (parentElem.className.includes('telephone') || parentElem.className.includes('phone')) {
                setTitle('Telephone');
            }
        }
    }, [targetElement, title]);

    const onCaptureStateAction = useCallback(() => {
        if (captureState) {
            let isMinerCapturedExist;

            isMinerCapturedExist = !!targetState.target.data.isMinerCaptured;

            if (targetHolder) {
                let innerText, nodeName, groupContainerExist, currentContainer;
                let isCapturedLink, isCapturedImage, isCapturedTextEmpty;

                setSelectedElementText(targetElement.innerText);

                innerText = targetElement.innerText;
                nodeName = targetElement.nodeName;

                isCapturedTextEmpty = innerText === '';
                isCapturedImage = nodeName === 'IMG';
                isCapturedLink = nodeName === 'A';

                if ((isCapturedTextEmpty && !isCapturedImage) || interactAlertOpen || isMinerCapturedExist) {
                    return setShowDrawer(false);
                }

                if (isCapturedImage) {
                    let imageSrc;

                    setTitle('Images');

                    imageSrc = selectedElementAttributes?.src;
                    innerText = `The selected element is an image: ${imageSrc}`;
                } else if (isCapturedLink) {
                    let href, isHrefExist;

                    isHrefExist = !!selectedElementAttributes.href;

                    if (isHrefExist) {
                        setTitle('Links');

                        href = selectedElementAttributes.href;
                        innerText = `The selected element is a link: ${href}`;
                    } else innerText = `The selected element has no href`;
                }

                setSelectedElementText(innerText);
                setShowDrawer(true);
                setTargetHolder(null);

                groupContainerExist = !!targetState.target.data.groupContainerSelector;

                currentContainer =
                    groupContainerExist && document.querySelector(targetState.target.data.groupContainerSelector);

                if (currentContainer !== targetElement) targetElement.style.border = 'none';

                autoDetectionDetails();
            }
        }
    }, [
        captureState,
        targetElement,
        targetHolder,
        selectedElementAttributes,
        targetState.target.data.isMinerCaptured,
        targetState.target.data.groupContainerSelector,
        interactAlertOpen,
        autoDetectionDetails,
    ]);

    useEffect(() => {
        onCaptureStateAction();

        return () => {
            onCaptureStateAction();
        };
    }, [onCaptureStateAction]);

    //** Alert Logic **//

    const onAlertOkClick = () => {
        resetAllConfig(captureDispatch, targetDispatch, detailsDispatch);

        setSavedKeywords('');
        setShowDrawer(false);
        setContentClicked(false);
        setContentClickAlertOpen(false);
        setTargetHolder(null);

        GetTarget({ isMinerCaptured: false })(targetDispatch);

        message.success({
            key: 'msg-0-miner',
            content: 'You can now select elements anywhere!',
            onClose: (_) => message.destroy('msg-0-miner'),
        });
    };

    return (
        <>
            <SiteContent
                title={title}
                content={content}
                urlState={urlState}
                targetElement={targetElement}
                capturedData={capturedData}
                setCapturedData={setCapturedData}
                showDrawer={showDrawer}
                showModal={showModal}
                setShowModal={setShowModal}
                finalKeywords={finalKeywords}
                setFinalKeywords={setFinalKeywords}
                setShowDrawer={setShowDrawer}
                selectedElementText={selectedElementText}
                selectedElementType={selectedElementType}
                selectedElementAttributes={selectedElementAttributes}
                targetClasses={targetClasses}
                contentOnClick={contentOnClick}
                contentOnDoubleClick={contentOnDoubleClick}
                contentOnMouseover={contentOnMouseover}
                contentOnMouseout={contentOnMouseout}
                setkeywordsButton={setkeywordsButton}
                savedKeywords={savedKeywords}
                setSavedKeywords={setSavedKeywords}
                onSearch={onSearch}
            />

            <MinerCapturedAlert
                open={contentClickAlertOpen}
                setOpen={setContentClickAlertOpen}
                title="Previous Config will be Resetted"
                handleOk={onAlertOkClick}
            />
        </>
    );
};

export default SiteContentContainer;
