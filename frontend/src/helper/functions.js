// actions
import { ResetCapturedData } from 'store/actions/captureActions';
import { ResetTarget } from 'store/actions/targetActions';
import { RemoveAllDetails } from 'store/actions/detailsActions';

/**
 * Get the initials of firstname and lastname.
 *
 * @param {String} firstname
 * @param {String} lastname
 */
export const getNameInitials = (firstname, lastname) => {
    let firstnameInitial, lastnameInitial, initials, uppercaseInitials;

    if (!firstname || !lastname) return false;

    firstname = firstname.split('');
    firstnameInitial = firstname.shift();

    lastname = lastname.split('');
    lastnameInitial = lastname.shift();

    initials = `${firstnameInitial}${lastnameInitial}`;
    uppercaseInitials = initials.toUpperCase();

    return uppercaseInitials;
};

/**
 * material ui table sorter
 */
const descendingComparator = (a, b, orderBy) => {
    let convertAToMs = new Date(a.createdAt).getTime();
    let convertBtoMs = new Date(b.createdAt).getTime();

    if (orderBy === 'date' && convertAToMs < convertBtoMs) return -1;
    else if (orderBy === 'date' && convertAToMs > convertBtoMs) return 1;

    if (b[orderBy] < a[orderBy]) return -1;
    else if (b[orderBy] > a[orderBy]) return 1;

    return 0;
};

export const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = (array, comparator) => {
    if (array.length === 0) return;

    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};

/**
 * Converting Arrays and distributing them into Objects per elements.
 *
 * @param {Array} rows [[arr1],[arr2],[arr3]]
 * @param {Array} columns [col1, col2, col3]
 * @returns [{columns1:i1},{columns2:i2},{columns3:i3}]
 */
export const convertArraysToObjects = (rows, columns) => {
    let finalData, filteredFinalData, objectHolder, rowsLength, largestLength;

    if (!!!rows || !!!columns) return;

    finalData = [];
    rowsLength = rows.length;
    largestLength = 0;

    for (let y = 0; y < rowsLength; y++) {
        // get the largest length
        if (largestLength < rows[y].length) largestLength = rows[y].length;

        for (let x = 0; x < largestLength; x++) {
            objectHolder = {};

            for (let i = 0; i < columns.length; i++) {
                objectHolder['key'] = x;
                objectHolder[columns[i]] = rows[i][x];
            }

            finalData.push(objectHolder);
        }
    }

    // remove duplicates
    filteredFinalData = finalData.filter((data, index, self) => self.findIndex((t) => t.key === data.key) === index);

    return filteredFinalData;
};

/**
 * Makes the string first letter capitalize.
 *
 * @param {String} string
 * @returns Captialize String
 */
export const capitalize = (string) => {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const isNumber = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

/**
 * This will iterate all the keys for object a and object b and
 * filter it using the objProperty then return the required result
 * to the ant table sorter.
 *
 * @param {Filter} objProperty This will only get the property indicated.
 * @param {Object} a Object a to compare
 * @param {Object} b Object b to compare
 * @param {String} dateProperty If the row data is a timer use your date property.
 * @returns
 */
export const tableSorter = (objProperty, a, b, dateProperty = null) => {
    let result, allAKey, allBKey;

    allAKey = Object.keys(a);
    allBKey = Object.keys(b);

    allAKey.forEach(function eachkey(akey) {
        allBKey.forEach(function eachkey(bkey) {
            if (akey === objProperty && bkey === objProperty) {
                // specific for the timer, it uses the date
                if (dateProperty && objProperty === dateProperty) {
                    if (isNumber(a.date) && isNumber(b.date)) {
                        if (parseInt(a.date, 10) === parseInt(b.date, 10)) {
                            return 0;
                        }

                        result = parseInt(a.date, 10) > parseInt(b.date, 10) ? 1 : -1;
                    }
                }

                if (!a[akey]) return -1;
                if (!b[bkey]) return +1;

                if (isNumber(a[akey]) && isNumber(b[bkey])) {
                    if (parseInt(a[akey], 10) === parseInt(b[bkey], 10)) {
                        return 0;
                    }
                    result = parseInt(a[akey], 10) > parseInt(b[bkey], 10) ? 1 : -1;
                }

                if (isNumber(a[akey])) return -1;
                if (isNumber(b[bkey])) return 1;

                result = a[akey].localeCompare(b[bkey]);
            }
        });
    });

    return result;
};

//! for document target element selectors

//? newly added functions
export const getParentSelector = (target) => {
    if (!!!target) return '';

    const parentElement = (target.parentNode = '');
    // console.log('parentElement', parentElement);
    let parentClassSelector;
    const parentElementNodeName = parentElement.nodeName.toLowerCase();
    if (parentElement.className) {
        const arrParentClasses = parentElement.className.split(' ');
        const parentClasses = arrParentClasses.filter((c) => c !== '');
        parentClassSelector = `.${parentClasses.join('.')}`; //parentClassSelector.map((c) => `.${c}`);
    }

    const targetParentSelector = `${parentElementNodeName}${parentClassSelector}`;
    console.log('for follow link parent', targetParentSelector);
    return targetParentSelector;
};

export const convertTargetToSelector = (target, withClassSelector = true) => {
    if (!!!target) return '';

    const targetNodename = target.nodeName.toLowerCase();
    let targetClassSelector = '';
    if (target.className) {
        const arrParentClasses = target.className.split(' ');
        const parentClasses = arrParentClasses.filter((c) => c !== '');
        targetClassSelector = `.${parentClasses.join('.')}`;
    }
    return withClassSelector ? `${targetNodename}${targetClassSelector}` : targetNodename;
};

export const getSelectorForElement = (
    target,
    withParentClass = true,
    levelOfParent = 2,
    withParentClassLevel = levelOfParent
) => {
    if (!!!target) return false;

    let selector = convertTargetToSelector(target);
    if (levelOfParent === 0) return selector;
    const targetHasClasses = target.className ? true : false;
    let counter = 0;
    do {
        let tagName = target.tagName;
        let parentElement = target.parentElement;

        //check target if no class then assign first parent class
        // if (counter === 1) {
        //     if (!targetHasClasses) {
        //         selector = `${convertTargetToSelector(parentElement, true)} > `.concat(selector);
        //     } else {
        //         selector = `${convertTargetToSelector(parentElement, withParentClass)} > `.concat(selector);
        //     }
        // } else {
        //     selector = `${convertTargetToSelector(parentElement, withParentClass)} > `.concat(selector);
        // }

        //? with parent class
        if (withParentClass) {
            //if classlevel with parent is less than or equal to counter assign class
            if (counter < withParentClassLevel) {
                selector = `${convertTargetToSelector(parentElement, true)} > `.concat(selector);
            } else {
                selector = `${convertTargetToSelector(parentElement, false)} > `.concat(selector);
            }
        }
        //? without parent class
        else {
            if (!targetHasClasses && counter === 1) {
                //assign first parent of target if target has no class
                selector = `${convertTargetToSelector(parentElement, true)} > `.concat(selector);
            }
            selector = `${convertTargetToSelector(parentElement, false)} > `.concat(selector);
        }

        //if with parent class  - assign true all
        //level of parent with class
        //if without parent class - assign false all
        //if target has no class assign first class parent

        if (tagName.toLowerCase() === 'html') break;
        target = target.parentElement;
        counter++;
    } while (counter < levelOfParent);
    return selector;
};

export const getSpecificSelectorForElement = (target) => {
    if (!!!target) return '';

    let selector = '';
    const levelOfParent = 5; //5 level parent
    let counter = 1;
    while (target.parentElement) {
        let tagName = target.tagName;
        const siblings = Array.from(target.parentElement.children).filter((e) => e.tagName === tagName);
        selector =
            (siblings.indexOf(target)
                ? `${target.tagName}:nth-of-type(${siblings.indexOf(target) + 1})`
                : `${target.tagName}`) + `${selector ? ' > ' : ''}${selector}`;
        target = target.parentElement;
        if (counter === levelOfParent) break;
        counter++;
    }
    // return `html > ${selector.toLowerCase()}`;
    return `${selector.toLowerCase()}`;
};

//! for document target element selectors

/**
 * @param {captureDispatch} captureDispatch from context
 * @param {targetDispatch} targetDispatch from context
 * @param {Array} keysToNotRemove ['key1','key2',...]
 *
 * @returns {Boolean}
 */
export const resetAllConfig = async (captureDispatch, targetDispatch, detailsDispatch, keysToNotRemove = []) => {
    ResetCapturedData()(captureDispatch);
    RemoveAllDetails()(detailsDispatch);
    await ResetTarget(keysToNotRemove)(targetDispatch);

    return true;
};
