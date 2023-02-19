
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

//Spørsmålsvariabler, henter liste med spørsmål fra questions.json og nå i starten av scriptet definerer spørsmålnummeret som 0.
const questions = require('./questions.json');
let whichNumberQuestion = 0;

//Currentquiz forteller oss hvilket spørsmål vi er på, og currentQuestion og currentOption forteller oss hvilket spørsmål og hvilke alternativer som er tilgjengelige.
let currentQuiz = questions.quiz[whichNumberQuestion]
let currentQuestion = currentQuiz.question;
let currentOption = currentQuiz.options;

//setInterval er en funksjon som kjører funksjonen i første parameter hvert 30 sekund, og gjør at vi kan få et nytt spørsmål hvert 30 sekund
setInterval(sendNewQuestionToFrontend, 30000);

/* CORS - Cross Origin Resource Sharing: Disse linjene kan være brukbar i tilfelle vi får noen problemer med socket.io tilkobling fra eksterne klienter.
const cors = require('cors');
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Hører på GET requests, og server build mappen under /httpserver/build
//npm run build i reactapp, og kopier build filene til httpserver for nå
app.get('/', (req, res) => {
    res.sendFile(__dirname, 'build' , 'index.html');
})

//Looper gjennom spørsmålslisten og sender neste klare, og inkrementerer whichNumberQuestion.
//Når spørsmålslisten er ferdig, resettes whichNumberQuestion til 0, og starter quizzen på nytt.
function sendNewQuestionToFrontend() {
    if(questions.quiz[whichNumberQuestion]) {
        //Oppdater noen variabler slik at andre funksjoner som bruker dem har riktig informasjon om hvilket spørsmål vi er på
        currentQuiz = questions.quiz[whichNumberQuestion]
        currentOption = currentQuiz.options;
        io.emit('question', questions.quiz[whichNumberQuestion]);
        whichNumberQuestion++;
    }
    else {
        whichNumberQuestion = 0;
    }
    
}



function sendResponseToFrontend(username, response) {
    
    //Filtrerer bort rot og tull som gjerne blir lagt til strengene vi får mottatt av klienten.
    //Korte trekk, input-validering
    let filteredUsername = username.replace(/["]/g,'').replace(/\n/g, '');
    let filteredResponse = response.replace(/["]/g,'')

    //Sender et svar til front-enden med brukernavn og svar vi har fått fra klienten.
    io.emit('usr&res', (`${filteredUsername} : ${filteredResponse}\n`));
    
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

    //VerifySvar er en funksjon som sjekker om svaret er riktig eller feil, og returnerer true eller false.
    //For øyeblikket loggføres det kun i server-konsollen, men det kan sendes til klienten også.
    if(verifySvar(svar)) {
        console.log("Riktig svar");
    }
    else {
        console.log("Feil svar")
    }
    //Funksjonkall av sendResponseToFrontend, sender brukernavn og svar til storskjermen. 
    sendResponseToFrontend(brukernavn, svar);

    //Et placeholdersvar til klienten som sendte POST slik at den ikke bare suser og går for evig
    res.send("Success!");
});

//SOCKET.IO, venter på at klienter skal koble seg til, og tar verdier sendt derfra
io.on('connection', (socket) => {
    //Venter på at klienten skal sende en 'usr&response' melding, og tar inn brukernavn og svar
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