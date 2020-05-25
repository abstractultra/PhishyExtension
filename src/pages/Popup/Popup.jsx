import React, { useState, useEffect } from 'react';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [phishing, setPhishing] = useState('Checking...');
  const [probability, setProbability] = useState(0);

  async function scrapeUrl(url) {
    const response = await fetch(
      'https://phishy-backend.herokuapp.com/scrape-url',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
        }),
      }
    );
    const data = await response.json();
    return data.data;
  }

  async function getProbability(url) {
    const body = await scrapeUrl(url);
    const response = await fetch(
      `https://phishingnet.benjaminsmith.dev/MLLookup?text=${encodeURIComponent(
        body
      )}`,
      {
        method: 'POST',
      }
    );
    const data = await response.json();
    setPhishing(data.Prediction);
    setProbability(Math.round(data.Probability * 100));
    return data;
  }

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      setCurrentUrl(url);
      getProbability(url);
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
          <td>
            {typeof phishing === 'string'
              ? phishing
              : phishing
              ? 'Phishing'
              : 'Not Phishing'}
            , {probability.toString()}% confident
          </td>
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
