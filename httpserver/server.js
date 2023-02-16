
//Vi trenger Express, og vi må instansiere
const express = require('express');
const app = express();

//SOCKET IO
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

//JSON Parser
const bodyParser = require('body-parser');

//PATH FETCH
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));

/* CORS STUFF WOW ANNOYING
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',

};
app.use(cors(corsOptions));
*/


//SOCKETS FUNKER NÅ SÅ GÅR AN Å BEGYNNE PÅ DET
io.on('connection', (socket) => {
    console.log('User connected');
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Hører etter på GET requests, og forteller at vi kan servere index.html da
/*
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})*/


//Hører på GET requests, og server build mappen under /httpserver/build
//npm run build i reactapp, og kopier build filene til httpserver for nå
app.get('/', (req, res) => {
    res.sendFile(__dirname, 'build' , 'index.html');
})





function sendResponseToFrontend(username, response) {
    //TODO: Send response to frontend
    io.emit('usr&res', (`${username} has responded with: ${response}`));

    
}

                                //INPUT TIL SERVEREN

//Hører etter på inkommende post-requests
app.post('/', (req, res) => {
    //Lagre forventet resultat
    let postresult = req.body;
    
    //Resultatet deles opp i brukernavn og svar, slik at vi kan se hvem som svarte
    let brukernavn = JSON.stringify(postresult.brukernavn);
    let svar = JSON.stringify(postresult.svar);
    

    //Logger brukernavn og svar, sender derfra til en egen funksjon
    //BURDE UTFØRE SVAR-VALIDERING I EN EGEN FUNKSJON FØR DET SENDES TIL FRONTEND
    console.log(`${brukernavn}: ${svar}`);
    sendResponseToFrontend(brukernavn, svar);

    //Et placeholdersvar til klienten som sendte POST slik at den ikke bare suser og går for evig
    res.send("data received");
});

//-------------------------------------------------------------------------------------


//KJØRER SERVEREN
server.listen(3000, () => {
    console.log('Server hører nå etter');
})