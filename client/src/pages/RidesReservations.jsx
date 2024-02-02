import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RidesReservations() {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings for the specified ride
    axios.get(`/bookings/ridesreservations/${id}`)
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [id]);

  return (
    <div className="container mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">bookings for this ride</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found for this ride.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4">
          {bookings.map(booking => (
            <li key={booking._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <span className="text-lg font-semibold text-indigo-700">Name:</span> {booking.user.nom} {booking.user.prenom}
              </div>
              <div className="mb-4">
                <span className="text-lg font-semibold text-indigo-700">Phone number:</span> {booking.user.phone}
              </div>
              <div className="mb-4">
                <span className="text-lg font-semibold text-indigo-700">Booked places:</span> {booking.numberOfGuests}
              </div>
              <div>
                <span className="text-lg font-semibold text-indigo-700">Price:</span> {booking.price} DA
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
