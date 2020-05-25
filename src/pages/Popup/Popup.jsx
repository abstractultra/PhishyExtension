import React, { useState, useEffect } from 'react';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [phishing, setPhishing] = useState('Checking...');
  const [probability, setProbability] = useState(0);
  const [secure, setSecure] = useState(false);

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

  async function getProbability(body) {
    const response = await fetch(
      `https://phishingnet.benjaminsmith.dev/MLLookup`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: body,
        }),
      }
    );
    const data = JSON.parse(await response.json());
    const phishProbability = Math.round(data.Probability * 100);

    if (phishProbability < 95) setPhishing(false);
    else setPhishing(data.Prediction);

    setProbability(phishProbability);
    return data;
  }

  async function checkSecurity(url) {
    if (url.indexOf('https') > -1) return true;
    else return false;
  }

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      setCurrentUrl(url);
      checkSecurity(url).then((result) => setSecure(result));
      scrapeUrl(url).then((body) => {
        getProbability(body);
      });
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
          <td>
            {secure ? 'Encrypted with HTTPS' : 'Not encrypted with HTTPS'}
          </td>
        </tr>
        <tr>
          <td id="overallTitle">Overall: </td>
          <td id="overallValue">
            {!phishing && secure ? 'Site is secure' : 'Site is dangerous'}
          </td>
        </tr>
      </table>
    </div>
  );
};

const element = () => {};

export default Popup;
