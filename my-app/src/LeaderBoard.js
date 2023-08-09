import './App.css';
import BackgroundImage from './bghome.png';

import React, { useEffect , useState} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

function Leaderboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const { gameId } = useParams();
   
  useEffect(() => {
    async function handleLeaderboard() {
      const response = await fetch(`http://localhost:3000/games/${gameId}/rank`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUsers(generateUserComponents(data));
    }
    handleLeaderboard();
  }, [gameId]);


  const UserComponent = ({ user,num }) => {
    return(
      <div className="users">
        <div className='user'> {num}. {user.username} </div>
        <div className='user' >{parseFloat(parseFloat(user.balance)+parseFloat(user.stocksValue)).toFixed(2)}</div>
      </div>
    )
    
  }

  const generateUserComponents = (users) => {
    let pos=0;
    return users.map((user) => (
      <UserComponent num={++pos} user={user} />
    ));
  };

  return (
    <div className="container1" style={{
      backgroundImage: `url(${BackgroundImage})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}>
      <h1 className='title'>Leaderboard</h1>
      <div className='Leaderboard'>
        {users}
      </div>
      <button className='returnlogin' onClick={() => navigate({ pathname: '/' })}> Login Page</button>
    </div>
  );
}

export default Leaderboard;