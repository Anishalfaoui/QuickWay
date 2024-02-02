import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";

export default function RidesPage() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    axios.get('/user-rides').then(({ data }) => {
      setRides(data);
    });
  }, []);

  const handleDeleteRide = async (rideId) => {
    try {
      await axios.delete(`/delete-ride/${rideId}`);
      setRides((prevRides) => prevRides.filter((ride) => ride._id !== rideId));
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };

  return (
    <div>
      <AccountNav />
      <div className="mt-8">
        <Link
          className="block bg-indigo-700 text-white py-2 px-6 rounded-full text-center mb-4"
          to={'/account/rides/new'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 inline-block mr-1">
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          Create ride
        </Link>
        {rides.length > 0 &&
  rides.map((ride) => (
    <div key={ride._id} className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md p-4 mb-4">
      <div className="flex items-center ">
        <div className="text-xl font-bold">
          {ride.startingLocation} {' => '} {ride.destination} ({ride.availableSeats}Available seats)
        </div>
        <Link className="text-indigo-700 ml-24 cursor-pointer mt-2" to={`/account/ridesreservations/${ride._id}`} >
        
        
      
        See Bookings
      </Link>
      </div>
      <div className="text-sm text-gray-500">
        {format(new Date(ride.departureTime), "dd/MM/yyyy HH:mm")}
        
      </div>
      
      {/* Modifier Button */}
      <Link className="text-indigo-700 cursor-pointer mt-2" to={`/account/rides/${ride._id}`} >
        
        
      
        Change
      </Link>

      {/* Delete Button */}
      <button
        onClick={() => handleDeleteRide(ride._id)}
        className="absolute top-2 right-2 text-indigo-700 cursor-pointer"
      >
        <FaTrash />
      </button>
    </div>
  ))}

      </div>
    </div>
  );
}
