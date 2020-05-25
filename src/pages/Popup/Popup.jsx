import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [currentUrl, setCurrentUrl] = useState(' ');
  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      setCurrentUrl(url);
    });
  }, []);

  return (
    <div className="App">
      <h1>Phishy</h1>
      <p>This site is not a phishing site.</p>
      <p>{currentUrl}</p>
    </div>
  );
};

export default Popup;
