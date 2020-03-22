function eval() {
  // Do not use eval!!!
  return;
}

function expressionCalculator(expr) {
  function BracketsCounter(str) {
    let opened = 0;
    let closed = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "(") {
        opened++;
      } else if (str[i] === ")") {
        closed++;
      }
    }
    return opened == closed;
  }

  if (!BracketsCounter(expr)) {
    throw new Error("ExpressionError: Brackets must be paired");
  }

  const PRIORITY = {
    "*": 3,
    "/": 3,
    "+": 2,
    "-": 2,
    "(": 1,
    ")": 1
  };

  let exp = exprToArray(expr);

  function stringIsNumber(str) {
    if (str == " " || str == "") {
      return false;
    } else {
      return str / 1 == str;
    }
  }

  function exprToArray(exp) {
    let output = [];
    for (let i = 0; i < exp.length; i++) {
      if (stringIsNumber(exp[i])) {
        if (output.length > 0 && stringIsNumber(output[output.length - 1])) {
          output[output.length - 1] = output[output.length - 1] + exp[i];
        } else {
          output.push(exp[i]);
        }
      } else if (exp[i] in PRIORITY) {
        output.push(exp[i]);
      }
    }
    return output;
  }

  function sum(elem1, elem2) {
    return +elem1 + +elem2;
  }

  function sub(elem1, elem2) {
    return elem1 - elem2;
  }

  function mul(elem1, elem2) {
    return elem1 * elem2;
  }

  function div(elem1, elem2) {
    if (elem2 == 0) {
      throw new Error("TypeError: Division by zero.");
    }
    return elem1 / elem2;
  }

  function zrobPolska(exp) {
    let operationStack = [];
    let output = [];
    //Рассматриваем поочередно каждый символ:
    for (let i = 0; i < exp.length; i++) {
      //1. Если этот символ - число, то просто помещаем его в выходную строку.
      if (stringIsNumber(exp[i])) {
        output.push(exp[i]);
        continue;
      }

      //Если текущий символ - открывающая скобка, то помещаем ее в стек.
      if (exp[i] === "(") {
        operationStack.push(exp[i]);
        continue;
      }

      //Если текущий символ - закрывающая скобка, то извлекаем символы из стека в выходную строку до тех пор,
      //пока не встретим в стеке открывающую скобку (т.е. символ с приоритетом, равным 1), которую следует просто уничтожить. Закрывающая скобка также уничтожается.

      if (exp[i] === ")") {
        let i = operationStack.length - 1;
        while (operationStack[i] != "(") {
          output.push(operationStack.pop());
          i = operationStack.length - 1;
        }
        operationStack.pop();
        continue;
      }

      /*
2. Если символ - знак операции (+, -, *, / ), то проверяем приоритет данной операции.
Получив один из этих символов, мы должны проверить стек:

а) Если стек все еще пуст, или находящиеся в нем символы (а находится в нем могут только знаки операций и открывающая скобка)
имеют меньший приоритет, чем приоритет текущего символа, то помещаем текущий символ в стек.

б) Если символ, находящийся на вершине стека имеет приоритет, больший или равный приоритету текущего символа, то извлекаем символы из стека в выходную строку
до тех пор, пока выполняется это условие; затем переходим к пункту а).
    */

      if (exp[i] in PRIORITY) {
        if (
          operationStack.length == 0 ||
          PRIORITY[operationStack[operationStack.length - 1]] < PRIORITY[exp[i]]
        ) {
          operationStack.push(exp[i]);
        } else {
          while (
            PRIORITY[operationStack[operationStack.length - 1]] >=
              PRIORITY[exp[i]] &&
            operationStack.length > 0
          ) {
            output.push(operationStack.pop());
          }
          operationStack.push(exp[i]);
        }
      } else {
        throw new Error(
          "Can't read expression. Use ()+-*/ and integer numbers"
        );
      }
    }

    //Если вся входная строка разобрана, а в стеке еще остаются знаки операций, извлекаем их из стека в выходную строку.
    while (operationStack.length > 0) {
      output.push(operationStack.pop());
    }
    return output;
  }

  exp = zrobPolska(exp);

  function countPolskiNapis(polska) {
    let stack = [];
    let value1 = 0;
    let value2 = 0;
    let operation = "";
    let result = 0;

    for (let i = 0; i < polska.length; i++) {
      if (polska[i] in PRIORITY) {
        value2 = stack.pop();
        value1 = stack.pop();
        operation = polska[i];

        switch (operation) {
          case "+": {
            result = sum(value1, value2);
            break;
          }
          case "-": {
            result = sub(value1, value2);
            break;
          }
          case "*": {
            result = mul(value1, value2);
            break;
          }
          case "/": {
            result = div(value1, value2);
            break;
          }
        }

        stack.push(result);
      } else {
        stack.push(polska[i]);
      }
    }

    return +stack[0];
  }
  return countPolskiNapis(exp);
}

module.exports = {
  expressionCalculator
};
