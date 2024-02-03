import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
  }

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <p className="text-xl font-bold mb-4">Logged in as {user.name}</p>
          <p className="text-gray-600">{user.email}</p>
          <button onClick={logout} className="bg-indigo-700 text-white px-4 py-2 mt-4 rounded-full hover:bg-blue-600 transition duration-300">Logout</button>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}
    </div>
  );
}
