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
       
        <input  style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}
          type="text"
          value={voiture}
          onChange={ev => setvoiture(ev.target.value)}
          placeholder="voiture, for example: Commute to Work"
        />
         <div>
          <label htmlFor="startingLocationWilaya">Starting Location Wilaya:</label>
        
          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
  <select
    id="startingLocationWilaya"
    value={startingLocationWilaya}
    onChange={handleStartingLocationWilayaChange}
  >
    <option value="">Select a wilaya</option>
    {wilayaOptions}
  </select>
</div>

          
          
          <label htmlFor="startingLocationDaira">Starting Location Daira:</label>
         
          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          
          <select
            id="startingLocationDaira"
            value={startingLocationDaira}
            onChange={handleStartingLocationDairaChange}
            disabled={!startingLocationWilaya}
          >
            <option value="">Select a daira</option>
            {dairaOptions}
          </select>
          </div> 
          
          <label htmlFor="startingLocationCommune">Starting Location Commune:</label>
          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          
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
        </div>
        <div>
          
          <label htmlFor="destinationWilaya">Destination Wilaya:</label>
          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          
          <select
            id="destinationWilaya"
            value={destinationWilaya}
            onChange={handleDestinationWilayaChange}
          >
            <option value="">Select a wilaya</option>
            {wilayaOptions}
          </select>
          </div>
        
          <label htmlFor="destinationDaira">Destination Daira:</label>
          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          
          <select
            id="destinationDaira"
            value={destinationDaira}
            onChange={handleDestinationDairaChange}
            disabled={!destinationWilaya}
          >
            <option value="">Select a daira</option>
            {dairaOptionsd}
          </select>
          </div>
          
          <label htmlFor="destinationCommune">Destination Commune:</label>
          <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          
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
        
        </div>
        <br />
        <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>

        {preInput('Departure Time', 'Time at which your ride departs')}
        <input
  type="datetime-local"
  value={departureTime}
  onChange={ev => setDepartureTime(ev.target.value)}
  placeholder="Select date and time"
/></div>

        {preInput('Available Seats', 'Number of available seats in your ride')}
        <input style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}
          type="number"
          value={availableSeats}
          onChange={ev => setAvailableSeats(ev.target.value)}
        />
        {preInput('Price', 'Price per ride')}
        <input style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}
          type="number"
          value={price}
          onChange={ev => setPrice(ev.target.value)}
        />
       
      
       
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}
