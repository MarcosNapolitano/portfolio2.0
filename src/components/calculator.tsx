import React, { useEffect, useRef, useState } from 'react';
import '../styles/calculator.css'

//falta poner boton de borrar y que las cuentas de periodico no den "max digits reached"

export default function Calculator() {

  const [currentValue, setCurrentValue] = useState<string>('');
  const [expression, setExpression] = useState<string>(' ');
  const [result, setResult] = useState<string>();
  const [decimal, setDecimal] = useState<boolean>(false);
  const allowedKeys: Set<string> = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
  const allowedOperators: Set<string> = new Set(['+', '-', '*', '/'])
  const equalButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handlePress = (event: KeyboardEvent) => {
      const value = event.key;
      orangize(value);

      if (currentValue?.length === 15) return setResult('Max Digits Reached');
      if (value === '.') return handleDecimal();
      if (allowedOperators.has(value)) return handleOperator(value);
      if (value === '=' || value === 'Enter') return calculate();

      if (allowedKeys.has(value)) {
        expression === ' ' ? setExpression(value) : setExpression(expression.concat(value))

        if (currentValue.length === 1 && allowedOperators.has(currentValue)) {
          setCurrentValue(value);
        }
        else setCurrentValue(currentValue.concat(value));
      };
    };

    document.addEventListener("keydown", handlePress);
    return () => document.removeEventListener("keydown", handlePress);
  }, [currentValue, result]);

  const handleClick = (id: string, event: React.MouseEvent) => {

    if (currentValue?.length === 15) return setResult('Max Digits Reached');
    if (id === '.') return handleDecimal();
    if (id === '*' || id === '/' || id === '+') return handleOperator(id)
    if (id === '=') return calculate();

    //keeps focus in "=" button
    equalButton.current?.focus();

    expression === ' ' ? setExpression(id) : setExpression(expression.concat(id))
    setCurrentValue(currentValue.concat(id));
  };

  const handleDecimal = () => {
    if (decimal || !currentValue) return;
    setDecimal(true)
    setCurrentValue(currentValue.concat('.'));
  };

  const handleOperator = (newOperator: string) => {

    if (!currentValue) setExpression(`0${newOperator}`);
    else setExpression(`${currentValue}${newOperator}`);
    setDecimal(false);
    setCurrentValue(newOperator);
    if (result) setResult(undefined)
  };

  const calculate = () => {

    const lastElement = expression[expression.length - 1];
    if (allowedOperators.has(lastElement)) return;

    const result: string = eval(expression).toString();

    if (result.length > 19) setCurrentValue(`${result.slice(0, 18)}E`);
    else setCurrentValue(result);

    setExpression(`${expression}=`);
    setResult(result);
  };

  //reset is also called from backspace press but without an event
  const reset = (e?: React.KeyboardEvent) => {

    if (e) equalButton.current?.blur(); //prevents focus on AC
    setCurrentValue('')
    setResult(undefined)
    setExpression(' ')
  };

  //pressing the buttons go orange
  const orangize = (key: string) => {

    const element = document.getElementById(`N${key}`);
    if (!element) return;

    element.classList.toggle('drum-pad_active');
    setTimeout(() => {
      element.classList.remove('drum-pad_active')
    }, 100);
  };

  return (
    <div id="calculator">
      <div id='display-panel'>
        {/* pre keep spaces when display inits " " */}
        <pre><h2 id='display'>{expression}</h2></pre>
        <h2 id='result'>{currentValue}</h2>
      </div>
      <div id="botonera">
        <Button ref={equalButton} id="AC" click={(e) => reset(e)} />
        <Button id="/" click={(e) => handleClick('/', e)} />
        <Button id="X" click={(e) => handleClick('*', e)} />
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
      className="drum-pad">{props.id}</button>
  );
};
