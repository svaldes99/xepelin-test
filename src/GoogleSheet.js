import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

const GoogleSheet = () => {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [newRate, setNewRate] = useState('');

  const SPREADSHEET_ID = '2PACX-1vSemz3pLNNHX48BFdqar2K1X-6bhC5T4H8zl1PkzMi5luHafj3Sv-2wqSdkKTr7O_NjWPCP5S1owVpB';
  const CSV_URL = `https://docs.google.com/spreadsheets/d/e/${SPREADSHEET_ID}/pub?output=csv`;
  const GOOGLE_SCRIPT_API_URL = 'https://script.google.com/macros/s/AKfycbwmqFHX_cHPkWO8xqMh-FRRMSBxeJNL6Lm21bssJCSG-ifcG6WFcmcsGj8-2RQ6q131/exec';
  const ZAPIER_HOOK_URL = 'https://hooks.zapier.com/hooks/catch/6872019/oahrt5g/';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(CSV_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const csv = await response.text();
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            const rows = results.data.map((row) => ({
              idOp: row.idOp,
              tasa: row.tasa,
              email: row.email
            }));
            setData(rows);
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Please try again later.');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedRow = data.find(row => row.idOp === selectedId);
    if (!selectedRow) {
      alert('Selected ID not found.');
      return;
    }
    const userEmail = selectedRow.email;

    const updatedData = [...data];
    const indexToUpdate = updatedData.findIndex(row => row.idOp === selectedId);
    if (indexToUpdate !== -1) {
      updatedData[indexToUpdate].tasa = newRate.toString();
      setData(updatedData);
    } else {
      alert('Error updating data.');
      return;
    }

    const postData = {
      idOp: selectedId,
      tasa: newRate,
      email: userEmail
    };

    try {
      console.log('Sending request to Zapier...');
      console.log('Data to send:', postData);
      await fetch(ZAPIER_HOOK_URL, {
        method: 'POST',
        body: JSON.stringify(postData)
      });

      /* console.log('Sending request to Google Sheets...');
      console.log('Data to send:', postData);
      const googleResponse = await fetch(GOOGLE_SCRIPT_API_URL, {
        method: 'POST',
        body: JSON.stringify(postData)
      });
      console.log('Google Sheets Response:', googleResponse.data); // Mostrar respuesta de Google Sheets en consola */

      alert('Requests sent successfully!');
    } catch (error) {
      console.error('Error sending requests', error);
      alert('Failed to send requests, please try again.');
    }
  };

  return (
    <div>
      <h2>Google Sheet Embed</h2>
      <iframe
        src={`https://docs.google.com/spreadsheets/d/e/${SPREADSHEET_ID}/pubhtml`}
        width="600"
        height="400"
        title="Google Sheets"
      ></iframe>
      <h3>Edit Rate</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Select ID:
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            <option value="">Select ID</option>
            {data.map((row) => (
              <option key={row.idOp} value={row.idOp}>
                {row.idOp}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          New Rate:
          <input
            type="number"
            step="0.01"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default GoogleSheet;
