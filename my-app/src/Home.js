
import './App.css';
import React, { useState, useEffect } from "react";
import BackgroundImage from './bghome.png';
import img from './dashboard.png';
import {useParams,useNavigate } from "react-router-dom";
import logo from './AAPL.png';
import logo1 from './AMZN.png';
import logo2 from './CSCO.png';
import logo3 from './IBM.png';
import logo4 from './MSFT.png';

export default function Home() {
  const [username,setUsername] =useState("");
  const [balance,setBalance] =useState(4000);
  const [profit,setProfit]=useState(0);
  const [stocksValue,setStocksValue]=useState(0);
  const [amountValue,setAmountValue]=useState(4000);
  const [colorProfit,setColorProfit]=useState("white");
  const [round,setRound]=useState(1);
  const [stocks,setStocks]=useState([]);
  const [investments,setInvestments]=useState([]);
  const {gameId}=useParams();
  const { userId } = useParams();


  const navigate = useNavigate();

  async function fetchData(){
    const response = await fetch(`http://localhost:3000/games/${gameId}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const usern=data.username
    let balanceuser=(parseFloat(data.balance)).toFixed(2);
    const profitdata=data.profit;
    const stocksValue=data.stocksValue;
    let amountvalue = parseFloat(parseFloat(balanceuser) + parseFloat(stocksValue));
// Check if amountValue is a number using isNaN ()
if (!isNaN (amountvalue)) {
  // Call the toFixed () method on amountValue
  amountvalue = amountvalue.toFixed(2);
}
    setUsername(usern);
    setBalance(balanceuser);
   
    if (profitdata > 0) {
      setColorProfit("#14d214");
    } else if (profitdata < 0) {
      setColorProfit("red");
    } else {
      setColorProfit("white");
    }
    setProfit(profitdata);
    setStocksValue(stocksValue);
    setAmountValue(amountvalue)
    }

    async function fetchStocks(){
      const response = await fetch(
        `http://localhost:3000/games/${gameId}/currentround`,{
            method: "PUT",  
            headers: {
              "Content-Type": "application/json",
            },
          
           } );
           
      const stdata=await response.json();
      setStocks(generateStockComponents(stdata));
    }



    useEffect(() => {
    
      const fetchStocks = async () => {
        const response = await fetch(
          `http://localhost:3000/games/${gameId}/currentround`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
        const stdata = await response.json();
        setStocks(generateStockComponents(stdata));
      };

      const fetchRound = async () => {
        const response = await fetch(
          `http://localhost:3000/games/${gameId}/round`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const stdata = await response.json();
        setRound(stdata.currentRound);
      };
      const refresh = async () => {
        await handleInvestments(userId);
      };

      fetchData();
      refresh();
      fetchRound();
      fetchStocks();
      
    }, [gameId, userId]);

async function handleRound (gameId){
  if(round<30){
    const response = await fetch(
    `http://localhost:3000/games/${gameId}/nextround`,{
        method: "PUT",  
        headers: {
          "Content-Type": "application/json",
        },
      
       } );

       const fetchRound = async () => {
        const response = await fetch(
          `http://localhost:3000/games/${gameId}/round`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
        const stdata = await response.json();
          setRound(stdata.currentRound);
      };
    
      
      await fetchRound();
      await fetchData();
      const stocksdata= await response.json();
      setStocks(generateStockComponents(stocksdata));
      await handleInvestments(userId);
    }

  else{
      navigate({ pathname: `/games/${gameId}/leaderboard` });
    }

};



async function handleBuy(gameId, userId, symbol, stockAmount) {
  if(stockAmount>=1){
  const url = `http://localhost:3000/games/${gameId}/buy`;
  const data = {
    user_id: userId,
    Stock_Symbol: symbol,
    quantity: parseInt(stockAmount)
  };
  const response=await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
   
  if(response.ok){
    await handleInvestments(userId);
    await fetchData();
    await fetchStocks()}
    
 else{
  const dt = await response.json();
    alert(dt);}


 
}
  
  else{
    alert("Amount value must be 1 or higher");
  }

  
}

async function handleSell(gameId, userId, symbol, stockAmount) {
 
  if(stockAmount>=1){
    const url = `http://localhost:3000/games/${gameId}/sell`;
    const data = {
      user_id: userId,
      Stock_Symbol: symbol,
      quantity: parseInt(stockAmount)
    };
    const response= await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if(response.ok){
      await handleInvestments(userId);
      await fetchData();
      await fetchStocks();}
      
   else{
    const dt = await response.json();
      alert(dt);}
   
  }
    else{
      alert("Amount value must be 1 or higher");
    }



}

async function handleInvestments(userId){
  const url = `http://localhost:3000/games/${gameId}/investments`;
  const data = { user_id:userId};
  const response = await fetch(url, { // make the API call with fetch
    method: "PUT", // specify the HTTP method
    headers: { // specify the content type
    "Content-Type": "application/json"
    },
    body: JSON.stringify(data) // stringify the data object
    });
  const res= await response.json();
  setInvestments(generateInvestments(res));
} 

async function handleRate(gameId,stocksymbol){
  const url = `http://localhost:3000/games/${gameId}/rate-of-change`;
  const data = {symbol: stocksymbol};
  const response = await fetch(url, { // make the API call with fetch
    method: "PUT", // specify the HTTP method
    headers: { // specify the content type
    "Content-Type": "application/json"
    },
    body: JSON.stringify(data) // stringify the data object
    });
    
    if(response.ok){
    const res=await response.json();
    const rateofchange= res.rateOfChange;
    return rateofchange;}
    else{
      return "0.00%";
    }
}

function getPic(symbol){
  if(symbol==="AAPL"){
   return logo;}
  else if(symbol==="AMZN"){
   return logo1;}
   else if(symbol==="CSCO"){
    return logo2;}
  else if(symbol==="IBM"){
       return logo3;}
  else
    return logo4;
  
   
}






const StockComponent = ({ stock }) => {
  const [stockAmount, setStockAmount] = useState();
  const [rate, setRate] = useState();
  const [colorRate,setColorRate]=useState("black")

  const getColor = (rateOfChange) => {
  // Convert the rate of change string to a number by removing the '%' sign and parsing it as a float
  const rateOfChangeNumber = parseFloat(rateOfChange.replace("%", ""));

  // Check if the rate of change number is positive
  if (rateOfChangeNumber > 0) {
    // Return green as the color
    return "#089f08";
  } else if (rateOfChangeNumber < 0) {
    // Return red as the color
    return "red";
  } else {
    // Return white as the default color
    return "black";
  }
};

  useEffect(() => {
    const fetchRateOfChange = async () => {
      const rateOfChange = await handleRate(gameId, stock.stock_symbol);
      setRate(rateOfChange);
      setColorRate(getColor(rateOfChange));
    };

    fetchRateOfChange();
  }, []);

  return (
    <div className="sub-market">
    <div className='symbol'><img src={getPic(stock.stock_symbol)} alt="Logo"/></div>
     <div className="sub-sub-market">{stock.stock_symbol}</div>
     <div className="sub-sub-market" style={{color:colorRate}}>{rate}</div>
      <div className="sub-sub-market">${stock.price}</div>
      <div className='transactions'>
        <div className="Amount">
          Amount
          
          <input
            placeholder="0"
            type="number"
            min="1"
            className="input-field-stock"
            value={stockAmount}
            onChange={(event) => setStockAmount(event.target.value)}
          />
          </div>
        
        <div className="market-button">
          <button className="buy" onClick={()=>handleBuy(gameId,userId,stock.stock_symbol,stockAmount)} ><b>Buy</b></button>
        </div>
        <div className="market-button">
          <button className="sell" onClick={()=> handleSell(gameId,userId,stock.stock_symbol,stockAmount)} ><b>Sell</b></button>
        </div>
      </div>
    </div>
  );
};

// Function to generate the stock components based on stocks data
  const generateStockComponents = (stocksData) => {
    return stocksData.map((stock, index) => (
      <StockComponent key={index} stock={stock} />
    ));
  };


  function generateInvestments(investments) {
    return investments.map(investment => (
      <div className="investment" key={investment.symbol}>
        <div className='quantity'><b>{investment.symbol}</b></div>
        <div className='quantity'>{investment.quantity}</div>
        <div className='quantity'>${(parseFloat(investment.value)).toFixed(2)}</div>
      </div>
    ));
  }
  
  
  
 


    
return (
    
     <div className="container" style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
      
      <div className="nav" style={{fontFamily:"inter" , fontSize:"large"}}>
      <b>Round {round}</b>
      </div>

      <div className='subcontainer'>
    
      <div className="flex-left"> 
      <div className='dashboard'> <img src={img}  alt="Dash"/><b>Dashboard</b></div>
        <div className="Userinfo" >
          <div className="sub-william-left">
            Welcome <b>{username}</b>,
            <br></br>
            Your account value is
              <div className="balance"><b>${amountValue}</b></div>
            
          </div>
          <div className="sub-william-right">
              
    
              <div style={{WebkitTextFillColor:"white"}}>Available Amount = <b>${balance}</b></div>
              <div style={{WebkitTextFillColor:"white"}}>Stocks Value =<b>${stocksValue}</b> </div>
              <div><span style={{WebkitTextFillColor:"white"}} >Profit = </span> <span style={{ color: colorProfit }}>
              <b>{profit >= 0 ? `+$${Math.abs(profit).toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`}</b>
                   </span></div>
    
          </div>
    
        </div>
    
        <div className="market" >
        {stocks}
        </div>

        </div>
        <div className="flex-right">
        
        
        <div className="user-investments">
        <div className ="investment">
          <div> <b>STOCK SYMBOL</b></div>
          <div><b> QUANTITY</b></div>
          <div><b> CURRENT VALUE</b></div>
          </div>
          {investments}
    
        </div>
    
        <button className="button2" onClick={() => handleRound(gameId)} >
          Submit Round
        </button>
    
        
        </div>
        </div>
        </div>
      );
    }
    


