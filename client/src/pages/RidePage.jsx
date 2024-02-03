import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import AddressLink from "../AddressLink";
import Image from "../Image";
import mapboxgl from "mapbox-gl";

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default function RidePage() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get(`/rides/${id}`).then((response) => {
      setRide(response.data);

      // Initialize map
      mapboxgl.accessToken = "pk.eyJ1IjoidGhlYXNzZXQiLCJhIjoiY2tyb3V1ZTZmMWpsMDJubDdha2lsbXYxeSJ9.A_zwqkPVPGP75uNMSHlzNQ";
      const map = new mapboxgl.Map({
        container: "map", // container ID
        style: "mapbox://styles/mapbox/streets-v11", // style URL
        center: [response.data.slongitude, response.data.slatitude], // starting position [lng, lat]
        zoom: 13, // starting zoom
      });

      // Marker for the starting location
      // new mapboxgl.Marker().setLngLat([response.data.slongitude, response.data.slatitude]).addTo(map);
      
      // Marker for the destination
      // new mapboxgl.Marker().setLngLat([response.data.dlongitude, response.data.dlatitude]).addTo(map);
    });
  }, [id]);

  if (!ride) return null;

  const driverAge = calculateAge(ride.driver.datenaissance);

  return (
    <div className="container mx-auto mt-8 p-8 bg-white rounded-md shadow-lg">
      <h1 className="text-4xl font-bold mb-4 text-indigo-700 text-center ">The ride :</h1>
      <div className="flex items-center mb-4">
        <AddressLink>{ride.startingLocation}</AddressLink>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="mx-4 text-gray-500 w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
        <AddressLink>{ride.destination}</AddressLink>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="text-gray-700 text-xl font-semibold">{ride.description}</h2>
          </div>
          <div className="text-gray-700 mb-4">
            <p>
              <span className="font-semibold">Departure Time:</span>{" "}
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              }).format(new Date(ride.departureTime))}
            </p>
            <p>
              <span className="font-semibold">Available Seats:</span> {ride.availableSeats}
            </p>
            <p>
              <span className="font-semibold">Driver:</span> {ride.driver.nom} {ride.driver.prenom}
            </p>
            <p>
              <span className="font-semibold">Driver's Phone:</span> {ride.driver.phone}
            </p>

            <p>
              <span className="font-semibold">Driver's Age:</span> {driverAge}
            </p>
            <p>
              <span className="font-semibold">Driver's Gender:</span> {ride.driver.gender}
            </p>
            <p>
              <span className="font-semibold">Car:</span> {ride.voiture}
            </p>
          </div>
        </div>

        

        
      </div>
      <div>
          <BookingWidget ride={ride} />
        </div>

      {/* Map Section with mapboxgl */}
      <div id="map" style={{ height: "300px", width: "100%" }}></div>
    </div>
  );
}
//fin