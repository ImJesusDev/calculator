import React from 'react';
import styles from './Button.css'

const Button = (props) => {

  const { value, btnClicked } = props;

  return (<button onClick={() => { btnClicked(value) }} className={styles.button}>{value}</button>)

}

export default Button;