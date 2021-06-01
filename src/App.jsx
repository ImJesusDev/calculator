import React, { useState } from 'react';
import { HistoryContext } from './context/HistoryContext';
import Calculator from './containers/calculator/Calculator';
import History from './containers/history/History';
import styles from './App.css';

const App = () => {

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className={styles.container}>
      <button className={styles.toggleBtn} onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? 'Calculator' : 'History'}
      </button>
      <HistoryContext.Provider value={{ history, setHistory }}>
        {!showHistory ? <Calculator /> : <History />}
      </HistoryContext.Provider>
    </div>
  );
};

export default App;
