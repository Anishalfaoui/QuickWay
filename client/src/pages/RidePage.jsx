import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import AddressLink from "../AddressLink";
import Image from "../Image";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

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

    axios.get(`/rides/${id}`).then(response => {
      setRide(response.data);
    });
  }, [id]);

  if (!ride) return null;

  const driverAge = calculateAge(ride.driver.datenaissance);

  return (
    <div className="container mx-auto mt-8 p-8 bg-white rounded-md shadow-lg">
      <h1 className="text-4xl font-bold mb-4">{ride.title}</h1>
      <div className="flex items-center mb-4">
        <AddressLink>{ride.startingLocation}</AddressLink>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="mx-4 text-gray-500 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
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
          </div>
        </div>

        <div className="mb-8 rounded-xl overflow-hidden">
          <h2 className="text-xl font-semibold mb-2">{ride.voiture}</h2>
          {ride.photos?.[0] && (
            <Image className="object-cover w-full h-48" src={ride.photos?.[0]} alt="" />
          )}
        </div>

        <div>
          <BookingWidget ride={ride} />
        </div>
      </div>
    </div>
  );
}
