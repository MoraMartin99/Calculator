/* Variables globales */
/* --------------------------------------------------------------------------------------------------- */
const displayContent = document.querySelector(".displayContent");
const buttonContainer = document.querySelector(".buttonContainer");
let varA = null;
let varB = null;
let operator = null;
const errMessage = "UwUn't :(";
/* --------------------------------------------------------------------------------------------------- */

/* operaciones aritméticas */
/* --------------------------------------------------------------------------------------------------- */
const getAddition = (a, b) => {
    return a + b;
};

const getSubtraction = (a, b) => {
    return a - b;
};

const getMultiplication = (a, b) => {
    return a * b;
};

const getDivision = (a, b) => {
    return a / b;
};
/* --------------------------------------------------------------------------------------------------- */

/* resultado */
/* --------------------------------------------------------------------------------------------------- */
const parseVar = (varX) => {
    const regex1 = /^.+%$/;
    if (regex1.test(varX)) {
        const regex2 = /.+(?=%)/;
        return parseFloat(varX.match(regex2)[0]) / 100;
    } else {
        return parseFloat(varX);
    }
};

const getOperation = (operator) => {
    if (operator == "÷") {
        return getDivision;
    } else if (operator == "*") {
        return getMultiplication;
    } else if (operator == "-") {
        return getSubtraction;
    } else if (operator == "+") {
        return getAddition;
    }
};

const getResult = (a, b, operation) => {
    const errRegex = /error/i;
    let result = properRound(operation(a, b));

    if (errRegex.test(result)) {
        varA = null;
        varB = null;
        operator = null;
        console.log(result);
        return errMessage;
    }

    return result;
};

const printResult = () => {
    displayContent.innerText = getResult(parseVar(varA), parseVar(varB), getOperation(operator));
};

const properRound = (result) => {
    const expression = result.toString();
    const numRegex = /\d/g;
    const specialCaseReg = /e|^Infinity$|^NaN$/i;
    const decimalReg = /(?<=\.)\d+$/;
    let decimalLength = expression.match(decimalReg) === null ? 0 : expression.match(decimalReg)[0].split("").length;
    let resultNumLength = expression.match(numRegex) === null ? 0 : expression.match(numRegex).length;
    const correctDecimalLength = decimalLength === 0 ? 0 : 10 - (resultNumLength - decimalLength);
    let roundResult;

    if (resultNumLength <= 10 && !specialCaseReg.test(expression)) {
        return result;
    }

    if (resultNumLength - decimalLength <= 10 && !specialCaseReg.test(expression)) {
        roundResult =
            Math.round((result + Number.EPSILON) * Math.pow(10, correctDecimalLength)) /
            Math.pow(10, correctDecimalLength);
        return roundResult;
    }

    return `error: ${result}`;
};
/* --------------------------------------------------------------------------------------------------- */

/* validaciones */
/* --------------------------------------------------------------------------------------------------- */

const isValidInteger = (number) => {
    const regex = /^0%{0,1}$|^-{0,1}[1-9]{1}\d{0,9}%{0,1}$/gm;
    return regex.test(number);
};

const isValidDecimal = (number) => {
    const regex =
        /^(?=.{3,11}$)\d+\.{1}\d+$|^(?=.{3,12}$)-\d+\.{1}\d+$|^(?=.{3,12}$)\d+\.{1}\d+%{1}$|^(?=.{3,13}$)-\d+\.{1}\d+%{1}$/gm;
    return regex.test(number);
};

const isValidNumber = (number) => {
    if (isValidInteger(number) || isValidDecimal(number)) {
        return true;
    }
    return false;
};

const isValidPseudoExp = (expression) => {
    let lengthTest = false;
    let orderTest = false;

    const numRegex = /\d/g;
    const minusRegex = /^-$|^-\d(?!.*-.*)|^[^-]+$/;
    const percentageRegex = /^[^%]*\d%$|^[^%]+$/;
    const pointRegex = /^[^\.]*\d\.(?!.*\..*)|^[^\.]+$/;
    let numLength = expression.match(numRegex) === null ? 0 : expression.match(numRegex).length;

    if (expression.length > 0 && numLength <= 10) {
        lengthTest = true;
    }

    if (minusRegex.test(expression) && percentageRegex.test(expression) && pointRegex.test(expression)) {
        orderTest = true;
    }

    if (lengthTest && orderTest) {
        return true;
    }

    return false;
};
/* --------------------------------------------------------------------------------------------------- */

