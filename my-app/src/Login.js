import './App.css';
import React, { useState, useEffect } from "react";
import BackgroundImage from './bgentry.png';
import { BrowserRouter, useNavigate, Route, Routes,Outlet,useParams } from "react-router-dom";


export default function Login() {
    const [username,setUsername]=useState("");
    const [color, setColor] = useState("#3f34bc");
    const { gameId } = useParams();

    const navigate=useNavigate();

    async function handleSubmit(event) {
      event.preventDefault(); // prevent the default form submission behavior
      if (username.length < 3) { // check if the username is less than 3 characters long
        alert("The username should be min. 3 characters"); // alert the user with a message
        return; // stop the execution of the function
      }
      else{
        const url = `http://localhost:3000/games/${gameId}/join-game`; // construct the API URL
        const data = { username: username }; // create an object with the data
        const response = await fetch(url, { // make the API call with fetch
        method: "POST", // specify the HTTP method
        headers: { // specify the content type 
        "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // stringify the data object
        });
        
        const resdata = await response.json(); // get the JSON data from the response
        const userId = resdata.userId; // get the userId from the data
        navigate({pathname: `/games/${gameId}/${userId}`}); // navigate to the game page
      }

    }
  
    return (
      <div
        className="Loginuser"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          
        }}
      >
        <div className="UserForm" >

            <div><b>Game_Id:</b> <br/>
           {gameId} </div>
        
         
  
          <div className='username'>
            <b>Username</b> <br/>
         
          <input
            placeholder="Enter a username here"
            className="input-field-user"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          </div>
         <div>
          <button className="Button"  style={{ background: color }}
          onMouseEnter={() => setColor("#261ba9")}
          onMouseLeave={() => setColor("#3f34bc")}
          onClick={handleSubmit}
        >Start Game</button>
        </div>
        </div>
      </div>
    );
  }


  