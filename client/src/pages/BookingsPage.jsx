import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import BookingDates from "../BookingDates";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('/bookings').then(response => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="mt-8">
        {bookings?.length > 0 && bookings.map(booking => (
          <Link
            key={booking._id}
            to={`/account/bookings/${booking._id}`}
            className="block bg-gray-200 rounded-lg overflow-hidden shadow-md p-4 mb-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">
                {booking.ride.startingLocation} {'=>'} {booking.ride.destination}
              </div>
              <div className="text-sm text-gray-500">
                {format(new Date(booking.ride.departureTime), "dd/MM/yyyy HH:mm")}
              </div>
            </div>
          
            {/* <div className="my-2 text-gray-600">
              ⏰{" "}
              {format(new Date(booking.ride.departureTime), "dd/MM/yyyy HH:mm")}
            </div> */}
            <div className="my-2 text-lg font-semibold">
              {booking.numberOfGuests} Places
            </div>
            <div className="text-3xl font-bold">{booking.price} DA</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
