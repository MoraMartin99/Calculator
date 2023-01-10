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

/* funciones de la calculadora */
/* --------------------------------------------------------------------------------------------------- */

const addTextToDisplay = (text) => {
    displayContent.innerText += text;
};

const clearDisplay = () => {
    displayContent.innerText = "";
};

const deleteChar = () => {
    if (displayContent.innerText) {
        if (varA && operator && varB) {
            varA = null;
            varB = null;
            operator = null;
        }

        displayContent.innerText = displayContent.innerText.slice(0, displayContent.innerText.length - 1);
    }
};

const allClear = () => {
    varA = null;
    varB = null;
    operator = null;
    displayContent.innerText = "";
};
/* --------------------------------------------------------------------------------------------------- */

/* animaciones */
/* --------------------------------------------------------------------------------------------------- */
const secondsToMilliseconds = (second) => {
    const regex = /^\d+(?=s)|^\d+\.\d+(?=s)/i;
    const milliseconds = parseFloat(second.match(regex)[0]) * 1000;
    return milliseconds;
};

const showPulseButton = (element, animationDuration) => {
    new Promise((resolve, reject) => {
        removeChild(element, ".pulseChild");
        addDivChild(element, "pulseChild");
        const pulseChild = element.querySelector(".pulseChild");
        pulseChild.style.animationDuration = animationDuration;
        setTimeout(resolve, secondsToMilliseconds(animationDuration));
    }).then(() => {
        removeChild(element, ".pulseChild");
    });
};
/* --------------------------------------------------------------------------------------------------- */

/* manejadores de eventos */
/* --------------------------------------------------------------------------------------------------- */
const clickHandler = (e) => {
    let button = e.target;
    if (button.matches(".btn, .btn *")) {
        button = button.matches(".btn") ? button : button.parentElement;
        buttonAction(button.id);
        showPulseButton(button, "0.3s");
    }
};

const keyboardHandler = (e) => {
    const key = e.key;
    const numReg = /^\d$/;
    const delReg = /^Backspace$|^Delete$/;
    const perReg = /^%$/;
    const divReg = /^\/$/;
    const mulReg = /^\*$/;
    const subReg = /^-$/;
    const addReg = /^\+$/;
    const pointReg = /^\.$/;
    const equalReg = /^=$|^Enter$/;
    let keyid = null;

    if (numReg.test(key)) {
        keyid = "b" + key;
    } else if (delReg.test(key)) {
        keyid = "bDEL";
    } else if (perReg.test(key)) {
        keyid = "bPER";
    } else if (divReg.test(key)) {
        keyid = "bDIV";
    } else if (mulReg.test(key)) {
        keyid = "bMUL";
    } else if (subReg.test(key)) {
        keyid = "bSUB";
    } else if (addReg.test(key)) {
        keyid = "bADD";
    } else if (pointReg.test(key)) {
        keyid = "bPOINT";
    } else if (equalReg.test(key)) {
        e.preventDefault();
        keyid = "bEQU";
    }

    if (keyid) {
        buttonAction(keyid);
        showPulseButton(document.querySelector(`#${keyid}`), "0.3s");
    }
};

const buttonAction = (buttonID) => {
    /*  const numberRegex = /(?<=b)\d/i;
    const operatorRegex = /(?<=b)[-+*÷]/i; */
    const actionTable = {
        bAC: { value: allClear, type: "function" },
        bDEL: { value: deleteChar, type: "function" },
        bPER: { value: "%", type: "printable" },
        bDIV: { value: "÷", type: "operator" },
        bMUL: { value: "*", type: "operator" },
        bSUB: { value: "-", type: "operator" },
        bADD: { value: "+", type: "operator" },
        bPOINT: { value: ".", type: "printable" },
        bEQU: { value: "=", type: "total" },
        b0: { value: "0", type: "printable" },
        b1: { value: "1", type: "printable" },
        b2: { value: "2", type: "printable" },
        b3: { value: "3", type: "printable" },
        b4: { value: "4", type: "printable" },
        b5: { value: "5", type: "printable" },
        b6: { value: "6", type: "printable" },
        b7: { value: "7", type: "printable" },
        b8: { value: "8", type: "printable" },
        b9: { value: "9", type: "printable" },
    };
    if (displayContent.innerText === errMessage) {
        allClear();
    }

    if (actionTable[buttonID].type == "printable") {
        printableActions(actionTable[buttonID].value);
    } else if (actionTable[buttonID].type == "operator") {
        operatorActions(actionTable[buttonID].value);
    } else if (actionTable[buttonID].type == "function") {
        actionTable[buttonID].value();
    } else if (actionTable[buttonID].type == "total") {
        if (varA && operator && !varB && isValidNumber(displayContent.innerText)) {
            varB = displayContent.innerText;
            printResult();
        } else if (varA && operator && varB) {
            printResult();
        }
    }
};

const printableActions = (value) => {
    const expression = displayContent.innerText + value;

    if (isValidPseudoExp(expression)) {
        if (!varA) {
            addTextToDisplay(value);
        } else if (varA && !operator) {
            operator = displayContent.innerText;
            displayContent.innerText = "";
            addTextToDisplay(value);
        } else if (varA && operator) {
            addTextToDisplay(value);
        }
    }
};

const operatorActions = (value) => {
    const fullOperatorReg = /^[+*÷-]$/;

    if (!varA) {
        if (isValidNumber(displayContent.innerText)) {
            varA = displayContent.innerText;
            displayContent.innerText = value;
        } else if (displayContent.innerText === "" && value === "-") {
            displayContent.innerText = value;
        }
    } else if (varA && !operator) {
        if (displayContent.innerText === "") {
            displayContent.innerText = value;
        } else if (fullOperatorReg.test(displayContent.innerText) && value !== "-") {
            displayContent.innerText = value;
        } else if (fullOperatorReg.test(displayContent.innerText) && value === "-") {
            operator = displayContent.innerText;
            displayContent.innerText = value;
        }
    } else if (varA && operator && !varB) {
        if (isValidNumber(displayContent.innerText)) {
            varB = displayContent.innerText;
            varA = getResult(parseVar(varA), parseVar(varB), getOperation(operator)).toString();
            varB = null;
            operator = null;
            displayContent.innerText = value;
        }
    } else if (varA && operator && varB) {
        varA = getResult(parseVar(varA), parseVar(varB), getOperation(operator)).toString();
        varB = null;
        operator = null;
        displayContent.innerText = value;
    }
};
/* --------------------------------------------------------------------------------------------------- */

