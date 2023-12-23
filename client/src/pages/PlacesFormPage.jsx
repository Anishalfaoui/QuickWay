import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';
import AccountNav from '../AccountNav';
import data from '../selectwdc/data/algeria-cities.json';
export default function RidesFormPage() {
  const { id } = useParams();
  const [voiture, setvoiture] = useState('');
  const [startingLocation, setStartingLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [availableSeats, setAvailableSeats] = useState(1);
  const [departureTime, setDepartureTime] = useState('');
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoInputDisabled, setPhotoInputDisabled] = useState(false);
  const [startingLocationWilaya, setStartingLocationWilaya] = useState('');
  const [startingLocationDaira, setStartingLocationDaira] = useState('');
  const [startingLocationCommune, setStartingLocationCommune] = useState('');
  
  const [destinationWilaya, setDestinationWilaya] = useState('');
  const [destinationDaira, setDestinationDaira] = useState('');
  const [destinationCommune, setDestinationCommune] = useState('');

  const handleStartingLocationWilayaChange = (event) => {
    const selectedWilaya = event.target.value;
    setStartingLocationWilaya(selectedWilaya);
    setStartingLocationDaira('');
    setStartingLocationCommune('');
  };

  const handleStartingLocationDairaChange = (event) => {
    const selectedDaira = event.target.value;
    setStartingLocationDaira(selectedDaira);
    setStartingLocationCommune('');
  };

  const handleStartingLocationCommuneChange = (event) => {
    const selectedCommune = event.target.value;
    setStartingLocationCommune(selectedCommune);
  };

  const handleDestinationWilayaChange = (event) => {
    const selectedWilaya = event.target.value;
    setDestinationWilaya(selectedWilaya);
    setDestinationDaira('');
    setDestinationCommune('');
  };

  const handleDestinationDairaChange = (event) => {
    const selectedDaira = event.target.value;
    setDestinationDaira(selectedDaira);
    setDestinationCommune('');
  };

  const handleDestinationCommuneChange = (event) => {
    const selectedCommune = event.target.value;
    setDestinationCommune(selectedCommune);
  };

  const wilayaOptions = [...new Set(data.map((item) => item.wilaya_name_ascii))].map(
    (name) => (
      <option key={name} value={name}>
        {name}
      </option>
    )
  );

  const dairaOptions =
    startingLocationWilaya !== ''
      ? [...new Set(data.filter((item) => item.wilaya_name_ascii === startingLocationWilaya).map((item) => item.daira_name_ascii))].map(
          (name) => (
            <option key={name} value={name}>
              {name}
            </option>
          )
        )
      : null;

  const communeOptions =
    startingLocationDaira !== ''
      ? data
          .filter((item) => item.daira_name_ascii === startingLocationDaira)
          .map((item) => (
            <option key={item.commune_name_ascii} value={item.commune_name_ascii}>
              {item.commune_name_ascii}
            </option>
          ))
      : null;


      const dairaOptionsd =
      destinationWilaya !== ''
        ? [...new Set(data.filter((item) => item.wilaya_name_ascii === destinationWilaya).map((item) => item.daira_name_ascii))].map(
            (name) => (
              <option key={name} value={name}>
                {name}
              </option>
            )
          )
        : null;
  
    const communeOptionsd =
      destinationDaira !== ''
        ? data
            .filter((item) => item.daira_name_ascii === destinationDaira)
            .map((item) => (
              <option key={item.commune_name_ascii} value={item.commune_name_ascii}>
                {item.commune_name_ascii}
              </option>
            ))
        : null;   


  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get('/rides/' + id).then(response => {
      const { data } = response;
      setvoiture(data.voiture);
      setStartingLocation(data.startingLocation);
      setDestination(data.destination);
      setAvailableSeats(data.availableSeats);
      setDepartureTime(data.departureTime);
      setAddedPhotos(data.photos);
      setPrice(data.price);
    });
  }, [id]);

  function uploadPhoto(ev) {
    const files = ev.target.files;
    if (files.length === 0) {
      return;
    }

    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append('photos', files[i]);
    }

    axios
      .post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(response => {
        const { data: filenames } = response;
        setAddedPhotos(prev => [...prev, ...filenames]);
        setPhotoInputDisabled(true);
      })
      .catch(error => {
        console.error('Error uploading photos:', error);
        // Handle error and provide user feedback
      });
  }

  const removePhoto = (index) => {
    setAddedPhotos((prevState) => {
      const newPhotos = [...prevState];
      newPhotos.splice(index, 1);
      return newPhotos;
    });
    setPhotoInputDisabled(false);
  };

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }
  const fetchCoordinates = async (placeName) => {
    try {
      const response = await axios.get('/get-coordinates', {
        params: {
          placeName: placeName,
        },
      });
  
      const coordinates = response.data;
      console.log('Coordinates:', coordinates);
  
      return coordinates; // Return the coordinates object
    } catch (error) {
      console.error('Error fetching coordinates:', error.response?.data || error.message);
      throw error; // Rethrow the error to handle it in the caller
    }
  };
  

  function constructLocation(commune, daira, wilaya) {
    if (commune !== '') {
      return commune;
    } else if (daira !== '') {
      return `${daira}, ${wilaya}`;
    } else {
      return wilaya;
    }
  }
  
  async function saveRide(ev) {
    ev.preventDefault();
  
    const newStartingLocation = constructLocation(startingLocationCommune, startingLocationDaira, startingLocationWilaya);
    const newDestination = constructLocation(destinationCommune, destinationDaira, destinationWilaya);
  
    try {
      // Fetch coordinates for starting location
      const startingLocationCoordinates = await fetchCoordinates(newStartingLocation);
  
      // Fetch coordinates for destination
      const destinationCoordinates = await fetchCoordinates(newDestination);
  
      const rideData = {
        voiture,
        startingLocation: newStartingLocation,
        destination: newDestination,
        slongitude: startingLocationCoordinates.longitude,
        slatitude: startingLocationCoordinates.latitude,
        dlongitude: destinationCoordinates.longitude,
        dlatitude: destinationCoordinates.latitude,
        availableSeats,
        addedPhotos,
        departureTime,
        price,
      };
  
      if (id) {
        // update
        await axios.put('/rides', { id, ...rideData });
        setRedirect(true);
      } else {
        // new ride
        await axios.post('/rides', rideData);
        setRedirect(true);
      }
    } catch (error) {
      console.error('Error saving ride:', error);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  }
  
  
  
  

  if (redirect) {
    return <Navigate to={'/account/rides'} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={saveRide}>
        {preInput(
          'voiture',
          'voiture for your ride. Should be short and catchy as in advertisement'
        )}
       
        <input
          type="text"
          value={voiture}
          onChange={ev => setvoiture(ev.target.value)}
          placeholder="voiture, for example: Commute to Work"
        />
         <div>
          <label htmlFor="startingLocationWilaya">Starting Location Wilaya:</label>
          <br />
          <select
            id="startingLocationWilaya"
            value={startingLocationWilaya}
            onChange={handleStartingLocationWilayaChange}
          >
            <option value="">Select a wilaya</option>
            {wilayaOptions}
          </select>
          <br />
          <label htmlFor="startingLocationDaira">Starting Location Daira:</label>
          <br />
          <select
            id="startingLocationDaira"
            value={startingLocationDaira}
            onChange={handleStartingLocationDairaChange}
            disabled={!startingLocationWilaya}
          >
            <option value="">Select a daira</option>
            {dairaOptions}
          </select>
          <br />
          <label htmlFor="startingLocationCommune">Starting Location Commune:</label>
          <br />
          <select
            id="startingLocationCommune"
            value={startingLocationCommune}
            onChange={handleStartingLocationCommuneChange}
            disabled={!startingLocationDaira}
          >
            <option value="">Select a commune</option>
            {communeOptions}
          </select>
        </div>

        <div>
          <label htmlFor="destinationWilaya">Destination Wilaya:</label>
          <br />
          <select
            id="destinationWilaya"
            value={destinationWilaya}
            onChange={handleDestinationWilayaChange}
          >
            <option value="">Select a wilaya</option>
            {wilayaOptions}
          </select>
          <br />
          <label htmlFor="destinationDaira">Destination Daira:</label>
          <br />
          <select
            id="destinationDaira"
            value={destinationDaira}
            onChange={handleDestinationDairaChange}
            disabled={!destinationWilaya}
          >
            <option value="">Select a daira</option>
            {dairaOptionsd}
          </select>
          <br />
          <label htmlFor="destinationCommune">Destination Commune:</label>
          <br />
          <select
            id="destinationCommune"
            value={destinationCommune}
            onChange={handleDestinationCommuneChange}
            disabled={!destinationDaira}
          >
            <option value="">Select a commune</option>
            {communeOptionsd}
          </select>
        </div>
        
        {preInput('Departure Time', 'Time at which your ride departs')}
        <input
  type="datetime-local"
  value={departureTime}
  onChange={ev => setDepartureTime(ev.target.value)}
  placeholder="Select date and time"
/>

        {preInput('Available Seats', 'Number of available seats in your ride')}
        <input
          type="number"
          value={availableSeats}
          onChange={ev => setAvailableSeats(ev.target.value)}
        />
        {preInput('Price', 'Price per ride')}
        <input
          type="number"
          value={price}
          onChange={ev => setPrice(ev.target.value)}
        />
        <div>photos</div>
        <div>des photos</div>
        {addedPhotos.length > 0 &&
          addedPhotos.map(link => (
            <div key={link}>
              <img src={link} alt="" />
              <button onClick={() => removePhoto(link)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          ))}
        <button>
          <input
            type="file"
            multiple
            onChange={uploadPhoto}
            disabled={photoInputDisabled}
            aria-label="Upload Photos"
            accept="image/*"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <span> </span> télécharger
        </button>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}
