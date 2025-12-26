 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/App.scss';

function App() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [sql, setSql] = useState('');
  const [results, setResults] = useState([]);
  const [hint, setHint] = useState('');

  // Load assignments when app loads
  useEffect(() => {
    axios.get('http://localhost:5000/api/assignments')
      .then(res => setAssignments(res.data))
      .catch(err => console.log('Error loading assignments:', err));
  }, []);

  // Run SQL
  const runQuery = () => {
    if (!sql) return;
    axios.post('http://localhost:5000/api/query/run', { sql })
      .then(res => setResults(res.data.rows))
      .catch(err => setResults([{ error: err.response?.data?.error }]));
  };

  // Get LLM hint
  const getHint = () => {
    if (!selectedAssignment) return;
    axios.post('http://localhost:5000/api/query/hint', { question: selectedAssignment.description })
      .then(res => setHint(res.data.hint))
      .catch(err => setHint('Could not get hint'));
  };

  if (!selectedAssignment) {
    return (
      <div className="app">
        <h1 className="app__title">SQL Assignments</h1>
        {assignments.map(a => (
          <div key={a.id} className="assignment-card" onClick={() => setSelectedAssignment(a)}>
            <h3 className="assignment-card__title">{a.title}</h3>
            <p className="assignment-card__desc">{a.description}</p>
            <span className="assignment-card__diff">Difficulty: {a.difficulty}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="app">
      <button className="app__back" onClick={() => { setSelectedAssignment(null); setResults([]); setHint(''); }}>Back</button>
      <h2>{selectedAssignment.title}</h2>
      <p>{selectedAssignment.description}</p>

      <textarea
        className="sql-textarea"
        value={sql}
        onChange={e => setSql(e.target.value)}
        placeholder="Write your SQL here"
      />

      <div className="buttons">
        <button onClick={runQuery}>Run Query</button>
        <button onClick={getHint}>Get Hint</button>
      </div>

      {hint && <div className="hint-box">{hint}</div>}

      {results.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              {Object.keys(results[0]).map(col => <th key={col}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => <td key={j}>{val}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
