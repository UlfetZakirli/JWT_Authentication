import "./App.css";
import axios from "axios";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const refreshToken = async () => {

  };


  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8000/api/login', { username, password })
      setUser(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    setSuccess(false)
    setError(false)

    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`, {
        headers: {
          authorization: `Bearer ${user.accessToken}`
        }
      })
      setSuccess(true)
    } catch (err) {
      setError(err)
    }
  }
  return (
    <div className="container">
      {user ? (
        <div className="home">
          <span>
            Welcome to the
            <b>{user.isAdmin ? "admin" : "user"} </b>
            dashboard
            <b>{user.username}</b>.
          </span>
          <span>Delete Users:</span>
          <button className="deleteButton" onClick={() => handleDelete(1)}>
            Delete Ulfat
          </button>
          <button className="deleteButton" onClick={() => handleDelete(2)}>
            Delete Aynure
          </button>
          {error && (
            <span className="error">
              You are not allowed to delete this user!
            </span>
          )}
          {success && (
            <span className="success">
              User has been deleted successfully...
            </span>
          )}
        </div>
      ) : (
        <div className="login">
          <form onSubmit={handleSubmit}>
            <span className="formTitle">Lama Login</span>
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="submitButton">
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;