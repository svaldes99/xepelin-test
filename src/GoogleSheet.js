import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const GoogleSheet = () => {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [newRate, setNewRate] = useState('');
  const [email] = useState('s.valdes1@uc.cl');

  const SPREADSHEET_ID = '2PACX-1vSemz3pLNNHX48BFdqar2K1X-6bhC5T4H8zl1PkzMi5luHafj3Sv-2wqSdkKTr7O_NjWPCP5S1owVpB';
  // const SHEET_NAME = 'Sheet1'; // Adjust the sheet name if necessary
  const CSV_URL = `https://docs.google.com/spreadsheets/d/e/${SPREADSHEET_ID}/pub?output=csv`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(CSV_URL);
        const csv = response.data;
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
    const postData = {
      idOp: selectedId,
      tasa: newRate,
      email: email
    };
    try {
      await fetch('https://hooks.zapier.com/hooks/catch/6872019/oahrt5g/', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
      alert('Request sent successfully!');
    } catch (error) {
      // Alerta con la descripción del error
      console.error('Error sending request:', error);
      // Descartar el error y mostrar un mensaje genérico

      alert('Failed to send request, please try again.');
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
