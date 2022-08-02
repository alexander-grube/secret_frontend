import { useState } from 'react'
import CryptoJS from 'crypto-js'
import './App.css'

function App() {
  const [data, setData] = useState('');
  const [ttl, setTtl] = useState(86400000000000);
  const [isActiveHour, setActiveHour] = useState(false);
  const [isActiveDay, setActiveDay] = useState(true);
  const [isActiveWeek, setActiveWeek] = useState(false);
  const [textAreaReadonly, setTextAreaReadonly] = useState(false);
  const [linkID, setLinkID] = useState('');
  const [secret, setSecret] = useState('');
  const secretMessage = useState(() => {
    if (window.location.search.includes('reveal')) {
      fetch(`https://go-test-secret.azurewebsites.net/api/secret/${location.search.split('reveal=')[1].split('_')[0]}`).then(res => res.text()).then(res => {
        const key1 = location.search.split('reveal=')[1].split('_')[1];
        const key2 = res.split('_')[1];
        setSecret(CryptoJS.AES.decrypt(res, key1+key2).toString(CryptoJS.enc.Utf8));
      }).catch(err => {
        console.log("ERROR:", err)
        });
    }
  });
  const domainName = window.location.origin;

  const toggleHour = () => {
    setActiveHour(true);
    setActiveDay(false);
    setActiveWeek(false);
    setTtl(3600000000000);
  };

  const toggleDay = () => {
    setActiveDay(true);
    setActiveHour(false);
    setActiveWeek(false);
    setTtl(86400000000000);
  };

  const toggleWeek = () => {
    setActiveWeek(true);
    setActiveHour(false);
    setActiveDay(false);
    setTtl(604800000000000);
  };

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(domainName + '?reveal=' + linkID).then(() => {
      console.log('Copied to clipboard');
    }).catch(err => {
      console.log('Error: ', err);
    });
  };

  const copySecretToClipBoard = () => {
    navigator.clipboard.writeText(secret).then(() => {
      console.log('Copied to clipboard');
    }).catch(err => {
      console.log('Error: ', err);
    });
  };


  const createSecret = async () => {
    const randomKey = CryptoJS.lib.WordArray.random(128 / 8).toString();
    let encrypted = CryptoJS.AES.encrypt(data, randomKey).toString();
    const key1 = randomKey.substring(0, randomKey.length / 2);
    const key2 = randomKey.substring(randomKey.length / 2, randomKey.length);
    encrypted = encrypted + '_' + key2;
    await fetch('https://go-test-secret.azurewebsites.net/api/secret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: encrypted,
        ttl
      })
    })
      .then(res => res.text())
      .then(res => {
        setTextAreaReadonly(true);
        setLinkID(res + "_" + key1);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2><a href={`${window.location.origin}`} className='App-link'>Secret Message</a></h2>
        {document.location.search.includes('reveal') ? (
          <div className='div-header'>
            <textarea readOnly className='textarea-responsive' value={secret}></textarea>
            <p>
              <button onClick={copySecretToClipBoard}>Copy to clipboard</button>
            </p>
          </div>
        ) : (
          <div className='div-header'>
            <p>Lifetime</p>
            <div className="btn-group">
              <button onClick={toggleHour} className={isActiveHour ? 'active' : undefined}>1 Hour</button>
              <button onClick={toggleDay} className={isActiveDay ? 'active' : undefined}>1 Day</button>
              <button onClick={toggleWeek} className={isActiveWeek ? 'active' : undefined}>1 Week</button>
            </div>
            <textarea readOnly={textAreaReadonly} className='textarea-responsive' placeholder='Secret message goes here...' value={data} onChange={(e) => setData(e.target.value)} />
            <p>
              {linkID != '' ? <button type="button" onClick={() => copyToClipBoard()}>Copy Link</button> : <button type="button" disabled={data.trim().length == 0} onClick={() => createSecret()}>
                Create Secret
              </button>}
            </p>
          </div>
        )}


      </header>
    </div>
  )
}

export default App
