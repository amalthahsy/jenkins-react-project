import React, { useState } from 'react';
import './App.css';

function App() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  // Simple API call to JSONPlaceholder (free fake API)
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Jenkins CI/CD Demo</h1>
        <p>A Simple React App with Automated Deployment</p>
        
        <div className="counter-section">
          <h2>Counter: {count}</h2>
          <button onClick={() => setCount(count + 1)}>
            Click Me!
          </button>
        </div>

        <div className="api-section">
          <h2>API Test</h2>
          <button onClick={fetchData} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
          {apiData && (
            <div className="api-result">
              <h3>{apiData.title}</h3>
              <p>{apiData.body}</p>
            </div>
          )}
        </div>

        <p className="version">Version: 1.0.0 - Built by Jenkins</p>
      </header>
    </div>
  );
}

export default App;