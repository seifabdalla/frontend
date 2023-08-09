import './App.css';
import React, { useState, useEffect } from "react";
import BackgroundImage from './bgentry.png';
import { BrowserRouter, useNavigate, Route, Routes,Outlet } from "react-router-dom";



export default function App() {
  const [gameIdd, setGameIdd] = useState("");
  const [color, setColor] = useState("#3f34bc");
  const [colorjoin, setColorjoin] = useState("#3f34bc");
  const navigate = useNavigate();

  const handleClicknewgame = async () => {
    const response = await fetch("http://localhost:3000/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const gameId = data.Game_id;
      navigate({ pathname: `/games/${gameId}` });
    } else {
      console.error(response.status);
    }
  };

  const handleChange = async (event) => {
    const gameId = gameIdd;
    setGameIdd(gameId);
    const isValiddata = await checkGameId(gameId);
    const valid=isValiddata.valid
    if(valid){
      navigate({pathname: `/games/${gameId}`})
    }
    else{
      alert("The gameId is invalid")
    }
  };

  async function checkGameId (gameId){
    const response = await fetch(
      `http://localhost:3000/games/check?id=${gameId}`,{
          method: "GET",  
          headers: {
            "Content-Type": "application/json",
          },
        

         } );
    const data = await response.json();
    return data;
  };

  return (
    <div
      className="Login"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <h1 style={{ marginTop: "10%", color:"#201881" }}>Techstock</h1>
      <div className="LoginSession">
        <button
          className="Button"
          onClick={handleClicknewgame}
          style={{ background: color }}
          onMouseEnter={() => setColor("#261ba9")}
          onMouseLeave={() => setColor("#3f34bc")}
        >
          New game session
        </button>
        <div className="input field">
          <input
            placeholder="Enter a game id"
            className="input-field"
            value={gameIdd}
            onChange={(event)=> setGameIdd(event.target.value)}
          />

        <button className='JoinGame'
        style={{ background: colorjoin}}
        onMouseEnter={() => setColorjoin("#261ba9")}
        onMouseLeave={() => setColorjoin("#3f34bc")}
        onClick={handleChange}
        > Join </button>
        </div>
      </div>
    </div>
  );
}



