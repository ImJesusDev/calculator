import React, { useState, useContext } from 'react';
import Display from '../../components/display/Display';
import Button from '../../components/button/Button';
import { HistoryContext } from '../../context/HistoryContext';
import styles from './Calculator.css';

const Calculator = () => {

  const { history, setHistory } = useContext(HistoryContext);
  const [display, setDisplay] = useState('');
  const [errors, setErrors] = useState('');

  /* Buttons to display */
  const calculatorButtons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+', 'del', 'reset'
  ];

  const handleClick = (value) => {
    switch (value) {
      // Reset display content
      case 'reset':
        setDisplay('');
        break;
      case 'del':
        // Split to create array
        const arr = display.toString().split('');
        // Remove last element
        arr.pop();
        // Join and set new value
        setDisplay(arr.join(''));
        break;
      case '=':
        // Empty errors
        setErrors('');
        try {
          // calculate the result of the operation
          const result = eval(display);
          // Add operation to history state
          setHistory([...history, [display, result]]);
          // Set the result
          if (!isNaN(result)) {
            setDisplay(result);
          }
        } catch (error) {
          setErrors(error.message);
        }
        break;
      default:
        // If required, clean up the value
        // setDisplay(`${display}${value.replace(/[^\d.+=\-\*\/]/g, '')}`)
        // Remove leading zeros
        setDisplay(`${display.toString().replace(/\b0+/g, '')}${value}`)
        break;
    }
  }
  return (
    /* Main container */
    <div className={styles.calculator}>

      {/* Calculator display */}
      <Display display={display} />

      {/* Buttons container */}
      <div className={styles.btnContainer}>
        {calculatorButtons.map((btn) => <Button btnClicked={handleClick} value={btn} key={btn} />)}
      </div>

      {/* Errors */}
      {errors && <div className={styles.errors}>{errors}</div>}

    </div>
    /* End main container */
  );
}

export default Calculator;