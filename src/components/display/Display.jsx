import React from 'react';
import styles from './Display.css';

const Display = (props) => {
  const { display } = props;

  return <div className={styles.display}> {display} </div>;
};

export default Display;
