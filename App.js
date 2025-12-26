  
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/App.scss';
function App() {
const [list, setList] = useState([]);           
const [current, setCurrent] = useState(null);     
const [query, setQuery] = useState('');          
const [data, setData] = useState([]);            
const [tip, setTip] = useState('');             
useEffect(() => {
axios.get('http://localhost:5000/api/assignments')
 .then(res => setList(res.data))
.catch(err => console.log('Error loading assignments:', err));
}, []);
 const run = () => {
    if (!query) return;
axios.post('http://localhost:5000/api/query/run', { sql: query })
.then(res => setData(res.data.rows))
.catch(err => setData([{ error: err.response?.data?.error }]));
};
  const getTip = () => {
if (!current) return;
axios.post('http://localhost:5000/api/query/hint', { question: current.description })
.then(res => setTip(res.data.hint))
.catch(err => setTip('Could not get hint'));
};
 if (!current) {
return (
<div className="app">
 <h1 className="app__title">SQL Assignments</h1>
{list.map(item => (
<div key={item.id} className="assignment-card" onClick={() => setCurrent(item)}>
 <h3 className="assignment-card__title">{item.title}</h3>
<p className="assignment-card__desc">{item.description}</p>
<span className="assignment-card__diff">Difficulty: {item.difficulty}</span>
</div>
))}
</div>
);
}
 return (
 <div className="app">
<button className="app__back" onClick={() => {
setCurrent(null);
setData([]);
setTip('');
}}>
Back
</button>
<h2>{current.title}</h2>
<p>{current.description}</p>
<textarea
className="sql-textarea"
value={query}
onChange={e => setQuery(e.target.value)}
placeholder="Write your SQL here"/>
<div className="buttons">
<button onClick={run}>Run Query</button>
<button onClick={getTip}>Get Hint</button>
</div>
{tip && <div className="hint-box">{tip}</div>}
{data.length > 0 && (
<table className="results-table">
<thead>
<tr>
{Object.keys(data[0]).map(col => (
<th key={col}>{col}</th>))}
</tr>
</thead>
<tbody>
{data.map((row, i) => (
<tr key={i}>
{Object.values(row).map((val, j) => (
<td key={j}>{val}</td>))}
</tr>
))}
</tbody>
</table>)}
</div> );
}

export default App;
