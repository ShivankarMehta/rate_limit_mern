import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post("http://localhost:5000/rate/register", {
        username,
        email,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 429) {
          setMessage("Too many registration attempts. Try again later.");
        } else if (error.response.status === 400) {
          setMessage(error.response.data.error || error.response.data.errors[0].msg);
        } else {
          setMessage("Something went wrong. Please try again.");
        }
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
    </div>
  );
};

export default Register;
