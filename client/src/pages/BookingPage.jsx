import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
//exportation (booking page )
export default function BookingPage() {
  const {id} = useParams();
  const [booking,setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({_id}) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return '';
  }


 
  
  
  
 
  
  return (
    <div className="my-8 mx-auto max-w-2xl border p-4">
      <div className="text-lg mb-2">{booking.chauffeur.nom} {booking.chauffeur.prenom}</div>
      <div className="text-lg mb-2">{booking.chauffeur.phone}</div>
      <div className="text-lg mb-2">{booking.ride.voiture}</div>
     
      <AddressLink className="my-2 block text-gray-600">
        📍 {booking.ride.startingLocation}
      </AddressLink>
      <AddressLink className="my-2 block text-gray-600">
        🚗 {booking.ride.destination}
      </AddressLink>
      <div className="my-2 block text-gray-600">
        ⏰{" "}
        {new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(booking.ride.departureTime))}
      </div>

      
        
        
          
            <div className="text-lg mb-2">{booking.numberOfGuests} Places</div>
            <div className="text-3xl font-bold">{booking.price} DA</div>
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            className="w-10 h-10 ml-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
        
        
      

      {/* Additional creative elements or features can be added here */}
    </div>
  );
}
//finn