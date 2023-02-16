import {io} from 'socket.io-client';
import './App.css';
import {useState, useEffect} from'react';



function App() {

const [UserResponse, setUserResponse] = useState();

let socket = io();

//Error Catcher
socket.on("connect_error", (err) => {
  console.log('connect_error: ', err);
})

socket.on('usr&res', (usrres) => {
  console.log('usr&res: ', usrres);
  setUserResponse(usrres);
})
  return (
    <>
    {UserResponse}
    </>
  );
}

export default App;