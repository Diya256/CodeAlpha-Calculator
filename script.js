const currentDisplay = document.getElementById("currentDisplay");
const previousDisplay = document.getElementById("previousDisplay");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

let currentValue = "0";
let previousValue = "";
let operator = null;
let resetCurrent = false;


// Update calculator display
function updateDisplay() {
    currentDisplay.textContent = currentValue;

    if (previousValue && operator) {
        previousDisplay.textContent =
            `${previousValue} ${displayOperator(operator)}`;
    } else {
        previousDisplay.textContent = "";
    }
}


// Change operator symbols for display
function displayOperator(op) {
    if (op === "*") return "×";
    if (op === "/") return "÷";
    return op;
}


// Add numbers and decimal point
function appendNumber(value) {

    if (currentValue === "Error") {
        currentValue = "0";
    }

    if (resetCurrent) {
        currentValue = value === "." ? "0." : value;
        resetCurrent = false;
    }

    else if (value === "." && currentValue.includes(".")) {
        return;
    }

    else if (currentValue === "0" && value !== ".") {
        currentValue = value;
    }

    else {
        currentValue += value;
    }

    updateDisplay();
}


// Select an operator
function chooseOperator(nextOperator) {

    // Percentage
    if (nextOperator === "%") {
        currentValue = String(parseFloat(currentValue) / 100);
        updateDisplay();
        return;
    }

    // If an operation is already waiting, calculate it first
    if (operator && !resetCurrent) {
        calculate();
    }

    previousValue = currentValue;
    operator = nextOperator;
    resetCurrent = true;

    updateDisplay();
}


// Perform calculation
function calculate() {

    if (!operator || previousValue === "") {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                currentValue = "Error";
                previousValue = "";
                operator = null;
                resetCurrent = true;
                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    // Avoid long decimal results
    result = parseFloat(result.toFixed(10));

    previousDisplay.textContent =
        `${firstNumber} ${displayOperator(operator)} ${secondNumber} =`;

    currentValue = String(result);
    previousValue = "";
    operator = null;
    resetCurrent = true;

    currentDisplay.textContent = currentValue;
}


// Clear everything
function clearCalculator() {

    currentValue = "0";
    previousValue = "";
    operator = null;
    resetCurrent = false;

    updateDisplay();
}


// Delete last number
function deleteLast() {

    if (currentValue === "Error") {
        clearCalculator();
        return;
    }

    if (resetCurrent) {
        return;
    }

    if (currentValue.length === 1) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }

    updateDisplay();
}


// Number buttons
numberButtons.forEach(button => {

    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });

});


// Operator buttons
operatorButtons.forEach(button => {

    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });

});


// Action buttons
actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteLast();
        }

        if (action === "calculate") {
            calculate();
        }

    });

});


// Keyboard support
document.addEventListener("keydown", event => {

    if (event.key >= "0" && event.key <= "9") {
        appendNumber(event.key);
    }

    else if (event.key === ".") {
        appendNumber(".");
    }

    else if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    }

    else if (event.key === "%") {
        chooseOperator("%");
    }

    else if (event.key === "Enter" || event.key === "=") {
        calculate();
    }

    else if (event.key === "Backspace") {
        deleteLast();
    }

    else if (event.key === "Escape" || event.key.toLowerCase() === "c") {
        clearCalculator();
    }

});