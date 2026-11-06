let currentOperand = '0';
let previousOperand = '';
let currentOperator = null;
let shouldResetScreen = false;

const display = document.getElementById('display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const clearButton = document.querySelector('[data-action="clear"]');
const backspaceButton = document.querySelector('[data-action="backspace"]');
const calculateButton = document.querySelector('[data-action="calculate"]');

function updateDisplay() {
    display.innerText = currentOperand;
}

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;

    if (shouldResetScreen) {
        currentOperand = number === '.' ? '0.' : number;
        shouldResetScreen = false;
    } else if (currentOperand === '0') {
        if (number === '.') {
            currentOperand += '.';
        } else {
            currentOperand = number;
        }
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

function chooseOperator(operatorAction) {
    if (currentOperator !== null && !shouldResetScreen) {
        calculate(); 
    }
    previousOperand = currentOperand;
    currentOperator = operatorAction;
    shouldResetScreen = true;
}

function calculate() {
    if (currentOperator === null || shouldResetScreen) return;

    let result;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (currentOperator) {
        case 'add':
            result = prev + current;
            break;
        case 'subtract':
            result = prev - current;
            break;
        case 'multiply':
            result = prev * current;
            break;
        case 'divide':
            if (current === 0) {
                result = "Error";
            } else {
                result = prev / current;
            }
            break;
        default:
            return;
    }

    currentOperand = result.toString();
    currentOperator = null;
    shouldResetScreen = true;
    updateDisplay();
}

function clear() {
    currentOperand = '0';
    previousOperand = '';
    currentOperator = null;
    updateDisplay();
}

function backspace() {
    if (shouldResetScreen) return;
    if (currentOperand.length === 1 || currentOperand === "Error") {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.dataset.number);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.action === 'calculate') return;
        chooseOperator(button.dataset.action);
    });
});

clearButton.addEventListener('click', clear);
backspaceButton.addEventListener('click', backspace);
calculateButton.addEventListener('click', calculate);

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/[0-9]/.test(key)) appendNumber(key);
    if (key === '+' || key === '-') chooseOperator(key === '+' ? 'add' : 'subtract');
    if (key === '*' || key === 'x') chooseOperator('multiply');
    if (key === '/' || key === '÷') chooseOperator('divide');
    if (key === 'Enter' || key === '=') calculate();
    if (key === 'Backspace') backspace();
    if (key === 'Escape' || key === 'c' || key === 'C') clear();
    if (key === '.') appendNumber(key);
});