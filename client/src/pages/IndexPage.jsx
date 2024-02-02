import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage() {
  const [rides, setRides] = useState([]);
  const [departureTimeTerm, setDepartureTimeTerm] = useState("");
  const [startingLocationTerm, setStartingLocationTerm] = useState("");
  const [destinationTerm, setDestinationTerm] = useState("");
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [proximityFilterActive, setProximityFilterActive] = useState(false);
  const [minDistance, setMinDistance] = useState(50);

  useEffect(() => {
    // Get user's geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    axios.get('/rides').then(response => {
      // Filter out rides with departure times in the past
      const filteredRides = response.data.filter(ride => new Date(ride.departureTime) > new Date());

      setRides(filteredRides);
    });
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const filteredRides = rides.filter(ride => {
    const searchTermDays = departureTimeTerm ? new Date(departureTimeTerm).getUTCDate() : undefined;
    const searchTermHours = departureTimeTerm ? parseInt(departureTimeTerm.split("T")[1].split(":")[0], 10) : undefined;
    const rideDepartureDays = new Date(ride.departureTime).getUTCDate();
    const rideDepartureHours = new Date(ride.departureTime).getHours();
    const hourRange = 2; // You can adjust this range as needed
    const departureTimeFilter =
      isNaN(searchTermDays) || isNaN(searchTermHours) ||
      (rideDepartureHours >= searchTermHours - hourRange &&
      rideDepartureHours <= searchTermHours + hourRange &&
      rideDepartureDays === searchTermDays);
  
    const proximityFilter =
      proximityFilterActive &&
      userCoordinates &&
      ride.slatitude &&
      ride.slongitude &&
      calculateDistance(
        userCoordinates.latitude,
        userCoordinates.longitude,
        ride.slatitude,
        ride.slongitude
      ) < minDistance; // Adjust the distance threshold as needed
  
    return departureTimeFilter && (proximityFilter || !proximityFilterActive) &&
      ride.startingLocation.toLowerCase().includes(startingLocationTerm.toLowerCase()) &&
      ride.destination.toLowerCase().includes(destinationTerm.toLowerCase());
  });
  

  return (
    <div>
     <div className="grid grid-cols-2 gap-4">
  <div className="flex flex-col gap-2">
    
    <input
      type="text"
      placeholder="Starting location..."
      value={startingLocationTerm}
      onChange={(e) => setStartingLocationTerm(e.target.value)}
      className="p-2 rounded border"
    />
    <input
      type="text"
      placeholder="Destination..."
      value={destinationTerm}
      onChange={(e) => setDestinationTerm(e.target.value)}
      className="p-2 rounded border"
    />
  </div>
  <div className="flex flex-col gap-2">
  
    
    <input
      type="number"
      placeholder="Distance approximité (km)..."
      
      onChange={(e) => setMinDistance(e.target.value)}
      className="p-2 rounded border"
    />
    <input
      type="datetime-local"
      placeholder="Departure time..."
      value={departureTimeTerm}
      onChange={(e) => setDepartureTimeTerm(e.target.value)}
      className="p-2 rounded border"
    />
  </div>
  
</div>
<button
    onClick={() => setProximityFilterActive(!proximityFilterActive)}
    className=" p-2 rounded  bg-indigo-700 text-white"
  >
    {proximityFilterActive ? "Désactiver" : " à proximité"}
  </button>


      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredRides.map(ride => (
         <div key={ride._id} className="relative bg-white rounded-lg overflow-hidden shadow-md transition duration-300 transform hover:scale-105">
         <Link to={ride.availableSeats > 0 ? `/ride/${ride._id}` : '#'}>
           <div className="aspect-w-16 aspect-h-9">
             {/* {ride.photos?.[0] && (
               <Image className="object-cover w-full h-full" src={ride.photos?.[0]} alt="" />
             )} */}
           </div>
           <div className="p-4 flex flex-col justify-between h-full">
             <div>
               <h2 className="text-xl font-bold mb-2">{ride.startingLocation} {'=>'} {ride.destination}</h2>
               <p className="text-sm text-gray-500 mb-2"> ⏰{" "}
                 {new Intl.DateTimeFormat("en-GB", {
                   day: "numeric",
                   month: "numeric",
                   year: "numeric",
                   hour: "numeric",
                   minute: "numeric",
                 }).format(new Date(ride.departureTime))}
               </p>
               <p className="text-sm text-gray-500 mb-2">
                 {ride.availableSeats > 0 ? `${ride.availableSeats} available seats` : 'Pas de place'}
               </p>
               <p className="text-lg font-bold">{ride.price}DA</p>
             </div>

             <div
               className={`${
                 ride.availableSeats > 0 ? 'bg-indigo-700' : 'bg-red-500'
               } text-white py-2 px-4 text-center`}
             >
               {ride.availableSeats > 0 ? 'Book this ride' : 'No Seats'}
             </div>
           </div>
         </Link>
       </div>
       
        ))}
      </div>
    </div>
  );
}
