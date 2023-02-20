
//Denne filen er et eksempel på hvordan man kan bygge en klient i Node som sender melding til Serveren i httpserver.
//Hver gang du kjører dette scriptet så vil du sende en socket.emit med informasjonen til serveren, i lik grad som en POST-request ville gjort. 
//Importer Socket.io klient
const io = require('socket.io-client')
const socket = io('http://localhost:3000');

//Definer hva brukernavnet vårt er og hva svaret vårt er
let brukernavn = 'moskito'
let svar = 'ABCDEF'


//Koble seg til socket serveren.
socket.on('connect', () => {
    console.log('connected')
})

//Send infromasjonen i et objekt som inneholder både brukernavn og svar, med identifikatoren 'usr&response'.
socket.emit('usr&response', {brukernavn, svar})

