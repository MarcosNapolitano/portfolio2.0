import React, { useEffect, useRef, useState } from 'react';
import '../styles/calculator.css'

export default function Calculator() {

  const [currentValue, setCurrentValue] = useState<string>('');
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>();
  const [decimal, setDecimal] = useState<boolean>(false);
  const [negative, setNegative] = useState<boolean>(false);

  const allowedKeys: Set<string> = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
  const allowedOperators: Set<string> = new Set(['+', '-', 'x', '/', '*'])
  const equalButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handlePress = (event: KeyboardEvent) => {
      const value = event.key;
      const shift = event.shiftKey;

      // searchbar in some browsers
      if (value === '/') event.preventDefault();

      orangize(value);
      shift ? routeValue(value, true) : routeValue(value);
    };

    document.addEventListener("keydown", handlePress);
    return () => document.removeEventListener("keydown", handlePress);
  }, [currentValue, result]);

  const handleClick = (id: string, event: React.MouseEvent) => {
    //keeps focus in "=" button
    equalButton.current?.focus();
    routeValue(id)
  };

  const routeValue = (value: string, shift?: true) => {

    if (currentValue?.length === 15) return setResult('Max Digits Reached');
    if (allowedOperators.has(value)) return handleOperator(value);
    if (value === '.') return handleDecimal();
    if (value === '=' || value === 'Enter') return calculate();
    if (value === 'Backspace' && shift) return reset();

    // don't delete if already a result
    if (value === 'Backspace' && !result) {
      setCurrentValue(currentValue.slice(0, currentValue.length - 1));
      setExpression(expression.slice(0, expression.length - 1));
    }

    if (allowedKeys.has(value)) {
      setExpression(expression.concat(value))

      if ((value === '0' && currentValue === '/') || negative && value === '0') {
        setResult('1')
        return setCurrentValue("Can't let you do that!")
      }

      if (negative) return setCurrentValue(currentValue.concat(value));

      // if a number follows an operator or we enter a number following a calculate
      // if result and new value we reset the expression
      if ((currentValue.length === 1 && allowedOperators.has(currentValue)) || result) {
        if (result) {
          // it's almost a full reset
          setExpression(value)
          setResult(undefined);
          setDecimal(false);
          setNegative(false);
        };
        setCurrentValue(value);
      }
      else setCurrentValue(currentValue.concat(value));
    };
  };

  const handleDecimal = () => {
    if (decimal || !currentValue || result) return;
    setDecimal(true)

    // if current is an operator
    if (allowedOperators.has(currentValue[currentValue.length - 1])) {
      setExpression(expression.concat('0.'));
      setCurrentValue('0.');
    }
    else {
      setExpression(expression.concat('.'));
      setCurrentValue(currentValue.concat('.'));
    }
  };

  const handleOperator = (newOperator: string) => {

    if (newOperator === '*') newOperator = 'x';
    if (newOperator === '-' && currentValue === '-') {
      setExpression(`${expression}(-`);
      setCurrentValue('(-');
      setNegative(true);
      return
    };

    if (!currentValue) setExpression(`0${newOperator}`);
    else if (result)
      setExpression(`${currentValue}${newOperator}`);
    else
      setExpression(`${expression}${newOperator}`);

    setDecimal(false);
    setCurrentValue(newOperator);
    if (result) setResult(undefined);
  };

  const calculate = () => {

    const lastElement = expression[expression.length - 1];
    if (allowedOperators.has(lastElement) || result) return;

    // to do: be able to recalculate based on previous result
    let newResult: string

    if (expression.indexOf('x') !== -1)
      newResult = eval(expression.replace("x", "*")).toString();
    else if (negative)
      newResult = eval(expression.concat(')')).toString();
    else
      newResult = eval(expression).toString();

    if (newResult.length > 19) setCurrentValue(`${newResult.slice(0, 18)}E`);
    else setCurrentValue(newResult);

    if (negative) {
      setNegative(false)
      setExpression(`${expression})=`);
    }
    else
      setExpression(`${expression}=`);

    setResult(newResult);
  };

  //reset is also called from backspace press but without an event
  const reset = (e?: React.KeyboardEvent) => {

    if (e) equalButton.current?.blur(); //prevents focus on AC
    setCurrentValue('');
    setExpression('');
    setResult(undefined);
    setNegative(false);
    setDecimal(false);
  };

  //pressing the buttons go orange
  const orangize = (key: string) => {

    if (key === "Backspace") key = 'AC'
    if (key === "Enter") key = '\='
    if (key === "*") key = 'X'

    const element = document.getElementById(`N${key}`);
    if (!element) return;

    element.classList.toggle('drum-pad_active');
    setTimeout(() => {
      element.classList.remove('drum-pad_active');
    }, 100);
  };

  return (
    <div className='calculator-root calculator calculator-bg'>
      <div className='display-panel'>
        {/* pre keep spaces when display inits " " */}
        <pre><h2 className='display'>{expression || ' '}</h2></pre>
        <pre><h2 className='display white'>{currentValue || ' '}</h2></pre>
      </div>
      <div className="botonera">
        <Button ref={equalButton} id="AC" click={(e) => reset(e)} />
        <Button id="/" click={(e) => handleClick('/', e)} />
        <Button id="X" click={(e) => handleClick('x', e)} />
        <Button id="7" click={(e) => handleClick('7', e)} />
        <Button id="8" click={(e) => handleClick('8', e)} />
        <Button id="9" click={(e) => handleClick('9', e)} />
        <Button id="-" click={(e) => handleClick('-', e)} />
        <Button id="4" click={(e) => handleClick('4', e)} />
        <Button id="5" click={(e) => handleClick('5', e)} />
        <Button id="6" click={(e) => handleClick('6', e)} />
        <Button id="+" click={(e) => handleClick('+', e)} />
        <Button id="1" click={(e) => handleClick('1', e)} />
        <Button id="2" click={(e) => handleClick('2', e)} />
        <Button id="3" click={(e) => handleClick('3', e)} />
        <Button id="=" click={(e) => handleClick('=', e)} />
        <Button id="0" click={(e) => handleClick('0', e)} />
        <Button id="." click={(e) => handleClick('.', e)} />
      </div>
    </div>
  );
}

function Button(props:
  {
    ref?: React.RefObject<HTMLButtonElement | null>,
    id: string,
    click: (event: any) => void
  }) {
  return (
    <button
      // id can't start with number or = in css 
      id={"N" + props.id}
      ref={props.ref}
      type="button"
      value={props.id}
      onClick={props.click}
      className="calculator-button drum-pad">{props.id}</button>
  );
};
