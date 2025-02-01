import React, { useState, useEffect } from "react";
import axios from "axios";

const Data = () => {
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/rate/data");
        setData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 429) {
          setError("Too many requests! Slow down.");
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div>
    <h2>Data from Server</h2>

    {error ? (
      <p style={{ color: "red" }}>{error}</p>
    ) : data ? (
      <>
        <p>{data.message}</p>
        <ul>
          {data.data.map((user) => (
            <li key={user._id}>
              {user.username} - {user.email}
            </li>
          ))}
        </ul>
      </>
    ) : (
      <p>Loading...</p>
    )}
  </div>
  );
};

export default Data;
