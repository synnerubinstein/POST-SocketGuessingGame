
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

//SPØRSMÅL
const questions = require('./questions.json');

//Manuelt satt currentQuestion og currentOption for øyeblikket: burde loope gjennom
let currentQuiz = questions.quiz[0]
let currentQuestion = currentQuiz.question;
let currentOption = currentQuiz.options;


/* CORS STUFF WOW ANNOYING
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',

};
app.use(cors(corsOptions));
*/





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

function sendNewQuestionToFrontend() {
    //TODO LIST THROUGH QUESTIONS.JSON
    io.emit('question', currentQuiz);
}



function sendResponseToFrontend(username, response) {
    
    let filteredUsername = username.replace(/["]/g,'').replace(/\n/g, '');
    let filteredResponse = response.replace(/["]/g,'')

    console.log(filteredUsername)

    //TODO: Send response to frontend
    io.emit('usr&res', (`${filteredUsername} : ${filteredResponse}\n`));
    

    //TEST LINE, bruk for å gi Frontend et spørsmål kun
    //io.emit('question', questions.quiz[0]);
    
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

    //VerifySvar funksjonen fungerer, men vet ikke om det er verdt å implementere før vi eventuelt har et scoringsystem
    //console.log(verifySvar(svar));
    sendResponseToFrontend(brukernavn, svar);

    //Et placeholdersvar til klienten som sendte POST slik at den ikke bare suser og går for evig
    res.send("data received");
});

//SOCKET.IO, venter på at klienter skal koble seg til, og tar verdier sendt derfra
io.on('connection', (socket) => {
    //Loggfører og sjekker hvor tilkoblingen kommer fra
    console.log(`Connection from: ${socket.request.connection.remoteAddress}`)
    //
    socket.on('usr&response', ({brukernavn, svar}) => {
        console.log(`${brukernavn}: ${svar}`);
        sendResponseToFrontend(brukernavn, svar);
    })
})


//VERIFISER SVARET
function verifySvar(svar) {
    //Fjerner de unødvendige "" fra strengen vår
    let optionId = svar.replace(/["]/g,'')

    // Find the option object with the same id
    const option = currentOption.find(o => o.id === optionId);

    // Check if the option has the isCorrect trait
    if (option.isCorrect) {
    return true;
    } else {
    return false;
    }
}




//-------------------------------------------------------------------------------------


//KJØRER SERVEREN
server.listen(3000, () => {
    console.log('Server hører nå etter');

})