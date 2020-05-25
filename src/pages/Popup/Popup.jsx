import React, { useState, useEffect } from 'react';
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
      <h1>PhishingNet</h1>
      <table id="displayTable">
        <tr>
          <td id="urlTitle">URL:</td>
          <td id="currentURL">{currentUrl}</td>
        </tr>
        <tr>
          <td id="phishingTitle">Phishing: </td>
          <td>{}</td>
        </tr>
        <tr>
          <td>Prediction: </td>
          <td>{}</td>
        </tr>
        <tr>
          <td>Certificate:</td>
          <td>{}</td>
        </tr>
        <tr>
          <td id="overallTitle">Overall: </td>
          <td id="overallValue">{}</td>
        </tr>
      </table>
    </div>
  );
};

const element = () => {};

export default Popup;
