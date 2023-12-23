import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [datenaissance, setDatenaissance] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function registerUser(ev) {
    ev.preventDefault();
    try {
      await axios.post('/register', {
        nom,
        prenom,
        gender,
        phone,
        datenaissance,
        email,
        password,
      });
      alert('Registration successful. Now you can log in');
    } catch (e) {
      alert('Registration failed. Please try again later');
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input type="text"
                 placeholder="nom"
                 value={nom}
                 onChange={ev => setNom(ev.target.value)} />
          <input type="text"
                 placeholder="prenom"
                 value={prenom}
                 onChange={ev => setPrenom(ev.target.value)} />
          <select
            value={gender}
            onChange={ev => setGender(ev.target.value)}
          >
            <option value="" disabled>Select Gender</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
          </select>
          <input type="text"
                 placeholder="Phone Number"
                 value={phone}
                 onChange={ev => setPhone(ev.target.value)} />
          <input type="date"
                 placeholder="Date of Birth"
                 value={datenaissance}
                 onChange={ev => setDatenaissance(ev.target.value)} />
          <input type="email"
                 placeholder="your@email.com"
                 value={email}
                 onChange={ev => setEmail(ev.target.value)} />
          <input type="password"
                 placeholder="password"
                 value={password}
                 onChange={ev => setPassword(ev.target.value)} />
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
