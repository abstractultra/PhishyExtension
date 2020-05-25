import React, { useState, useEffect } from 'react';
import Greetings from '../../containers/Greetings/Greetings';
import { Header, Message, Table, Icon } from 'semantic-ui-react';

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
    <div style={{ padding: '2em' }}>
      <Header size="huge">PhishingNet</Header>
      {!phishing && secure ? (
        <Message positive>This site should be safe.</Message>
      ) : (
        <Message negative>This site is not safe.</Message>
      )}
      <Table celled unstackable>
        <Table.Body>
          <Table.Row>
            <Table.Cell collapsing>URL</Table.Cell>
            <Table.Cell>{currentUrl}</Table.Cell>
          </Table.Row>
          <Table.Row positive={!phishing} negative={phishing}>
            <Table.Cell collapsing>Phishing</Table.Cell>
            {phishing ? (
              <Table.Cell>
                <Icon name="warning" />
                Phishing, {probability}% confident
              </Table.Cell>
            ) : (
              <Table.Cell>
                <Icon name="checkmark" />
                Not phishing, {probability}% confident
              </Table.Cell>
            )}
          </Table.Row>
          <Table.Row positive={secure} negative={!secure}>
            <Table.Cell collapsing>HTTPS</Table.Cell>
            {secure ? (
              <Table.Cell>
                <Icon name="checkmark"></Icon>Enabled
              </Table.Cell>
            ) : (
              <Table.Cell>
                <Icon name="warning"></Icon>Disabled
              </Table.Cell>
            )}
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};

const element = () => {};

export default Popup;
