import './App.css'
import {Route, Routes} from "react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import {UserContextProvider} from "./UserContext";
import ProfilePage from "./pages/ProfilePage.jsx";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import RidePage from "./pages/RidePage.jsx";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import RidesReservations from './pages/RidesReservations.jsx';
axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/rides" element={<PlacesPage />} />
          <Route path="/account/rides/new" element={<PlacesFormPage />} />
          <Route path="/account/rides/:id" element={<PlacesFormPage />} />
          <Route path="/account/ridesreservations/:id" element={<RidesReservations />} />
          <Route path="/ride/:id" element={<RidePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
