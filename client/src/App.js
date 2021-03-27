import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";

function App() {
    const [userData, setUserData] = useState({});

    const handleProtected = async e => {
        const headers = {
            authorization: `Bearer ${Cookie.get("jwt")}`
        };
        const response = await axios.get(
            "http://localhost:4000/auth/protected",
            { headers }
        );
        console.log(response.data);
    };

    const handleChange = e => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleLogin = async e => {
        e.preventDefault();

        const response = await axios.post("http://localhost:4000/auth/login", {
            data: userData
        });
        if (response.data.token) Cookie.set("jwt", response.data.token);
    };

    const handleSignup = async e => {
        e.preventDefault();

        const response = await axios.post("http://localhost:4000/auth/signup", {
            data: userData
        });
        console.log(response.data);
    };

    return (
        <div className="App">
            <form action="" onChange={handleChange}>
                <input type="text" placeholder="username" name="username" />
                <br />
                <br />
                <input type="password" placeholder="password" name="password" />
                <br />
                <br />
                <button type="submit" onClick={handleSignup}>
                    signup
                </button>
                <button type="submit" onClick={handleLogin}>
                    login
                </button>
            </form>

            <button onClick={handleProtected}>Access protected API</button>
        </div>
    );
}

export default App;
