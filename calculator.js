//Create by John Luan
// Modified by Yuxiang Luo on 10/31/2019

var operationhistory = {
  prevstates: [],
  currentIndex: 0
};
var calculator = {
  displayValue: "0",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  error: false,
  overwrite: false,
  memoryValue: null
};

function Key(keyButton, clickHandler) {
  this.keyButton = keyButton;
  this.clickHandler = clickHandler;
  this.keyButton.addEventListener("click", e => {
    clickHandler(e);
    updateDisplay();
  });
}

function DigitKey(keyButton, digit) {
  this.digit = digit;
  buttonPressHandler = e => {
    const { target } = e;
    digitClicked(target.value);
  };
  Key.call(this, keyButton, buttonPressHandler);
}

function OperatorKey(keyButton, operator) {
  this.operator = operator;
  buttonPressHandler = e => {
    const { target } = e;
    operatorClicked(target.value);
  };
  Key.call(this, keyButton, buttonPressHandler);
}

function getOperation(operator) {
  add = (op1, op2) => {
    return (parseFloat(op1) + parseFloat(op2)).toString();
  };
  subtract = (op1, op2) => {
    return (parseFloat(op1) - parseFloat(op2)).toString();
  };
  multiply = (op1, op2) => {
    return (parseFloat(op1) * parseFloat(op2)).toString();
  };
  divide = (op1, op2) => {
    if (parseFloat(op2) == 0) {
      return "error";
    }
    return (parseFloat(op1) / parseFloat(op2)).toString();
  };
  if (operator == "+") return add;
  if (operator == "-") return subtract;
  if (operator == "*") return multiply;
  if (operator == "/") return divide;
}

// Update the display to reflect the state
function updateDisplay() {
  console.log(calculator);
  var display = document.getElementById("result");
  if (calculator.error) {
    display.value = "ERROR";
  } else {
    display.value = calculator.displayValue;
  }
}

// Evaluate the calculator's state
function evaluateExpression() {
  if (calculator.operator != null) {
    operation = getOperation(calculator.operator);
    result = operation(calculator.firstOperand, calculator.displayValue);
    addHistoryElement(
      calculator.firstOperand,
      calculator.displayValue,
      calculator.operator,
      result
    );
    updateHistory();
    calculator.displayValue = result;
    calculator.firstOperand = result;
    calculator.waitingForSecondOperand = true;
  }
}
// Implementation of Digit clicked
function digitClicked(digit) {
  if (calculator.overwrite) {
    calculator.displayValue = digit;
    calculator.overwrite = false;
  } else {
    if (calculator.displayValue == "0") {
      calculator.displayValue = digit;
    } else {
      calculator.displayValue += digit;
    }
  }
}

// Implementation of Operator clicked
function operatorClicked(operator) {
  if (calculator.waitingForSecondOperand) {
    evaluateExpression();
  } else {
    calculator.firstOperand = calculator.displayValue;
    calculator.waitingForSecondOperand = true;
  }
  calculator.overwrite = true;
  calculator.operator = operator;
}

// Select all the digit keys
const digitKeys = document.getElementsByClassName("digit");
const digits = [];
for (var i = 0; i < digitKeys.length; i++) {
  digits[i] = new DigitKey(digitKeys[i], i);
}

// Select all the operator keys
const operatorKeys = document.getElementsByName("operator");
const operators = [];
for (var i = 0; i < operatorKeys.length; i++) {
  operators[i] = new OperatorKey(operatorKeys[i], operatorKeys[i].value);
}

// Select the equal key
const equalsKey = document.getElementsByClassName("equals")[0];
const equals = new Key(equalsKey, () => {
  evaluateExpression();
  calculator.operator = null;
  calculator.overwrite = true;
  calculator.waitingForSecondOperand = false;

  updateDisplay();
});

const clearKey = document.getElementsByName("clr")[0];
clearKey.addEventListener("click", () => {
  calculator = {
    displayValue: "0",
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    error: false,
    overwrite: false,
    memoryValue: null
  };
  updateDisplay();
});

const decimalKey = document.getElementsByName("decimal")[0];
decimalKey.addEventListener("click", () => {
  if (!calculator.displayValue.includes(".")) {
    calculator.displayValue += ".";
  }
  updateDisplay();
});

const addmemKey = document.getElementsByName("addmem")[0];
const addmem = new Key(addmemKey, () => {
  calculator.memoryValue = calculator.displayValue;
});

const recallmemKey = document.getElementsByName("recallmem")[0];
const recallmem = new Key(recallmemKey, () => {
  if (calculator.memoryValue != null) {
    calculator.displayValue = calculator.memoryValue;
  }
});

const removememKey = document.getElementsByName("removemem")[0];
const removemem = new Key(removememKey, () => {
  calculator.memoryValue = null;
});

const signKey = document.getElementsByName("sign")[0];
const sign = new Key(signKey, () => {
  if (calculator.displayValue != 0) {
    if (calculator.displayValue.startsWith("-")) {
      calculator.displayValue = calculator.displayValue.substring(
        1,
        calculator.displayValue.length - 1
      );
    } else {
      calculator.displayValue = "-" + calculator.displayValue;
    }
  }
  updateDisplay();
});

const sqrtKey = document.getElementsByName("sqrt")[0];
sqrtKey.addEventListener("click", () => {
  if (calculator.displayValue != 0) {
    if (calculator.displayValue.startsWith("-")) {
      //Do no thing
    } else {
      calculator.displayValue = Math.sqrt(calculator.displayValue).toString();
    }
    updateDisplay();
  }
});

const percentKey = document.getElementsByName("percent")[0];
percentKey.addEventListener("click", () => {
  if (calculator.displayValue != 0) {
    calculator.displayValue = (calculator.displayValue / 100).toString();
    updateDisplay();
  }
});

const sinKey = document.getElementsByName("sin")[0];
sinKey.addEventListener("click", () => {
  if (calculator.displayValue != 0) {
    calculator.displayValue = Math.sin(
      (calculator.displayValue / 180) * Math.PI
    ).toString();
    updateDisplay();
  }
});
const cosKey = document.getElementsByName("cos")[0];
cosKey.addEventListener("click", () => {
  if (calculator.displayValue != 0) {
    calculator.displayValue = Math.cos(
      (calculator.displayValue / 180) * Math.PI
    ).toString();
    updateDisplay();
  }
});
const tanKey = document.getElementsByName("tan")[0];
tanKey.addEventListener("click", () => {
  if (calculator.displayValue != 0) {
    calculator.displayValue = Math.tan(
      (calculator.displayValue / 180) * Math.PI
    ).toString();
    updateDisplay();
  }
});
const ansKey = document.getElementsByName("ANS")[0];
ansKey.addEventListener("click", () => {
  if (calculator.displayValue != 0) {
    calculator.displayValue =
      operationhistory.prevstates[
        operationhistory.prevstates.length - 1
      ].result;
    //operationhistory.prevstates.length = operationhistory.prevstates.length - 1;
    updateDisplay();
  }
});
const backKey = document.getElementsByName("Back")[0];
backKey.addEventListener("click", () => {
  if (calculator.displayValue != 0) {
    if (calculator.displayValue.startsWith("-")) {
      if (calculator.displayValue.length > 2) {
        var strvalue = calculator.displayValue;
        calculator.displayValue = strvalue.slice(0, strvalue.length - 1);
      } else {
        calculator.displayValue = "0";
      }
    } else {
      if (calculator.displayValue.length > 1) {
        var strvalue = calculator.displayValue;
        calculator.displayValue = strvalue.slice(0, strvalue.length - 1);
      } else {
        calculator.displayValue = "0";
      }
      updateDisplay();
    }
  }
});

function addHistoryElement(operator1, operator2, operator, result) {
  operationhistory.prevstates.push({
    operator1: operator1,
    operator2: operator2,
    operator: operator,
    result: result
  });
}

const historybox = document.getElementsByName("history")[0];

function updateHistory() {
  //clear the list
  historybox.innerHTML = "";
  for (var i = 0; i < operationhistory.prevstates.length; i++) {
    var element = operationhistory.prevstates[i];

    var content = `${element.operator1} ${element.operator} ${element.operator2} = ${element.result}`;
    var node = document.createElement("li");
    // Create a <li> node
    var textnode = document.createTextNode(content);
    // Create a text node
    node.appendChild(textnode);
    // Append the text to <li>
    historybox.appendChild(node);
  }
}

updateDisplay();
