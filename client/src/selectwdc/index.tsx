import React, { useState } from 'react';
import data from './data/algeria-cities.json';

function WilayaSelect(): JSX.Element {
  const [wilaya, setWilaya] = useState<string>('');
  const [daira, setDaira] = useState<string>('');
  const [commune, setCommune] = useState<string>('');

  const handleWilayaChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedWilaya = event.target.value;
    setWilaya(selectedWilaya);
    setDaira('');
    setCommune('');
  };

  const handleDairaChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedDaira = event.target.value;
    setDaira(selectedDaira);
    setCommune('');
  };

  const handleCommuneChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedCommune = event.target.value;
    setCommune(selectedCommune);
  };

  const wilayaOptions = [...new Set(data.map((item) => item.wilaya_name_ascii))].map(
    (name) => (
      <option key={name} value={name}>
        {name}
      </option>
    )
  );

  const dairaOptions =
    wilaya !== ''
      ? [...new Set(data.filter((item) => item.wilaya_name_ascii === wilaya).map((item) => item.daira_name_ascii))].map(
          (name) => (
            <option key={name} value={name}>
              {name}
            </option>
          )
        )
      : null;

  const communeOptions =
    daira !== ''
      ? data
          .filter((item) => item.daira_name_ascii === daira)
          .map((item) => (
            <option key={item.commune_name_ascii} value={item.commune_name_ascii}>
              {item.commune_name_ascii}
            </option>
          ))
      : null;

  return (
    <div>
      <label htmlFor="wilaya">Wilaya:</label>
      <br/>
      <select id="wilaya" value={wilaya} onChange={handleWilayaChange}>
        <option value="">Select a wilaya</option>
        {wilayaOptions}
      </select>
      <br/>
      <label htmlFor="daira">Daira:</label>
      <br/>
      <select id="daira" value={daira} onChange={handleDairaChange} disabled={!wilaya}>
        <option value="">Select a daira</option>
        {dairaOptions}
      </select>
      <br/>

      <label htmlFor="commune">Commune:</label>
      <br/>
      <select id="commune" value={commune} onChange={handleCommuneChange} disabled={!daira}>
        <option value="">Select a commune</option>
        {communeOptions}
      </select>
    </div>
  );
}

export default WilayaSelect;
