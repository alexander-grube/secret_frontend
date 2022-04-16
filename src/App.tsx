import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [isActiveHour, setActiveHour] = useState(false);
  const [isActiveDay, setActiveDay] = useState(false);
  const [isActiveWeek, setActiveWeek] = useState(false);

  const toggleHour = () => {
    setActiveHour(!isActiveHour);
    setActiveDay(false);
    setActiveWeek(false);
  };

  const toggleDay = () => {
    setActiveDay(!isActiveDay);
    setActiveHour(false);
    setActiveWeek(false);
  };

  const toggleWeek = () => {
    setActiveWeek(!isActiveWeek);
    setActiveHour(false);
    setActiveDay(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Secret Message</h2>
        <p>Lifetime</p>
        <div className="btn-group">
          <button onClick={toggleHour} className={isActiveHour ? 'active': undefined}>1 Hour</button>
          <button onClick={toggleDay} className={isActiveDay ? 'active': undefined}>1 Day</button>
          <button onClick={toggleWeek} className={isActiveWeek ? 'active': undefined}>1 Week</button>
        </div>
        <textarea className='textarea-responsive' placeholder='Secret message goes here...' value={message} onChange={(e) => setMessage(e.target.value)} />
        <p>
          <button type="button" onClick={() => console.log(message)}>
            Create Secret
          </button>
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
