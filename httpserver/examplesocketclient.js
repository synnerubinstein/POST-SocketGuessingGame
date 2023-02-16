
//Importer Socket.io klient
const io = require('socket.io-client')
const socket = io('http://localhost:3000');

//Definer hva brukernavnet vårt er og hva svaret vårt er
let brukernavn = 'moskito'
let svar = '3asdasdasd'


//Koble seg til socket serveren.
socket.on('connect', () => {
    console.log('connected')
})

//Send infromasjonen i et objekt som inneholder både brukernavn og svar, med identifikatoren 'usr&response'.
socket.emit('usr&response', {brukernavn, svar})

