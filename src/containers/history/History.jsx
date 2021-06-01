import React, { useContext } from 'react';
import { HistoryContext } from '../../context/HistoryContext';
import styles from './History.css';

const History = () => {

  const { history } = useContext(HistoryContext);

  return (
    <div className={styles.container}>
      {history.length ? history.map((h) => {
        return (
          /* Generate random key */
          <div className={styles.history} key={Math.random().toString(36).substring(7)}>
            <span>Operation: {h[0]}</span>
            <span>Result: {h[1]}</span>
          </div>
        );
      }) : <span className={styles.noOperations}>No operations</span>}
    </div>
  );
};

export default History;
