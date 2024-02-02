import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

export default function BookingWidget({ ride }) {
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');
  const { user } = useContext(UserContext);

  async function bookThisRide() {
    // Check if the requested number of guests exceeds the available seats
    if (numberOfGuests > ride.availableSeats) {
      alert("Cannot book more seats than available.");
      return;
    }

    const response = await axios.post('/bookings', {
      numberOfGuests,
      phone,
      ride: ride._id,
      price: numberOfGuests * ride.price,
    });

    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: {ride.price} DA / per ride
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>
        <div className="py-3 px-4 border-t">
          <label>Phone number:</label>
          <input
            type="tel"
            value={phone}
            onChange={(ev) => setPhone(ev.target.value)}
          />
        </div>
      </div>
      <button onClick={bookThisRide} className="primary mt-4">
        Book this ride
        {numberOfGuests > 0 && (
          <span> {numberOfGuests * ride.price} DA</span>
        )}
      </button>
    </div>
  );
}
