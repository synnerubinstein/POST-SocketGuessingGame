import {io} from 'socket.io-client';
import './App.css';
import {useState, useEffect, useRef} from'react';



function App() {

const [UserResponse, setUserResponse] = useState("");
const [currentQuestion, setCurrentQuestion] = useState("");
let eksempel = 0;

const [option1, setOption1] = useState("");
const [option2, setOption2] = useState("");
const [option3, setOption3] = useState("");
const [option4, setOption4] = useState("");

const textAreaRef = useRef(null)

useEffect(() => {
  let socket = io();

  //Error Catcher
  socket.on("connect_error", (err) => {
    console.log('connect_error: ', err);
  })

  socket.on('usr&res', (usrres) => {
    console.log('usr&res: ', usrres);
    let newMSG = UserResponse + usrres;
    setUserResponse(newMSG);
  })

  socket.on('question', (question) => {
    console.log('question: ', question.question);
    setCurrentQuestion(question.question);
    setOption1(question.options[0].text);
    setOption2(question.options[1].text);
    setOption3(question.options[2].text);
    setOption4(question.options[3].text);
  })

  //Scroll to the bottom of TextArea, sånn at vi får en oppdatert liste over hvem som sendte forrige pakke
  if(textAreaRef.current) {
    textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
  }

  return () => {
    socket.disconnect();
  };
}, [UserResponse])

  return (
    <>
    <h1>POST-Socket Guessing Game</h1>
    <p>Create your UI using socket.io or send POST requests</p>
    <h3>{currentQuestion}</h3>
    <h4>A: {option1}</h4>
    <h4>B: {option2}</h4>
    <h4>C: {option3}</h4>
    <h4>D: {option4}</h4>
    <textarea rows = '5' cols = '50' value={UserResponse} readOnly ref={textAreaRef}></textarea>
    </>
  );
}

export default App;