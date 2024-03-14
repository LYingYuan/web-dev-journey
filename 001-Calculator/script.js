let buffer = "0";
let total = 0;
let previousOperation = null;
const screen = document.querySelector(".screen");

function flushOperation(intBuffer) {
  switch (previousOperation) {
    case "+":
      total += intBuffer;
      break;
    case "-":
      total -= intBuffer;
      break;
    case "×":
      total *= intBuffer;
      break;
    case "+":
      total /= intBuffer;
      break;
  }
}

function handleMath(value) {
  if (buffer === "0") {
    return;
  }

  const intBuffer = parseInt(buffer);
  if (total === 0) {
    total = intBuffer;
  } else {
    flushOperation(intBuffer);
  }

  previousOperation = value;

  buffer = "0";
}

function rerender() {
  screen.innerText = buffer;
}

function handleOperation(value) {
  switch (value) {
    case "C":
      buffer = "0";
      total = 0;
      previousOperation = null;
      break;
    case "←":
      if (buffer.length === 1) {
        buffer = "0";
      } else {
        buffer = buffer.substring(0, buffer.length - 1);
      }
      break;
    case "=":
      if (previousOperation === null) {
        return;
      }

      flushOperation(parseInt(buffer));
      previousOperation = null;
      buffer = "" + total;
      total = 0;
      break;
    case "+":
    case "-":
    case "×":
    case "÷":
      handleMath(value);
      break;
  }
}

function handleNumber(value) {
  if (buffer === "0") {
    buffer = value;
  } else {
    buffer += value;
  }
}

function buttonClick(value) {
  if (isNaN(Number(value))) {
    handleOperation(value);
  } else {
    handleNumber(value);
  }
  rerender();
}

function init() {
  document.querySelector(".buttons").addEventListener("click", function (event) {
    buttonClick(event.target.innerText);
  });
}

init();
